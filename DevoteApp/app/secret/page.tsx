"use client";

import { Button } from "@/components/ui/button";
import { useContractCustom } from "@/hooks/use-contract";
import { useEth } from "@/hooks/use-eth";
import {
  decryptData,
  encryptData,
  generateAndDeployNewWalletFromPrivateKey,
  generatePrivateKeyEncrypted,
  getFutureWalletAdressFromPrivateKey,
} from "@/lib/starknet/createWallet";
import { UserPlus } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import crypto from 'crypto';

type SuperUserFormData = {
  email: string;
  fullName: string;
  ine: string;
  password: string;
};

export default function SecretPage() {
  const { createAdminOnChain, addWhiteList, vote } = useContractCustom();
  const { getEthBalance, sendEth } = useEth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<SuperUserFormData>();

  useEffect(() => {
    const checkAuthorization = () => {
      const params = new URLSearchParams(window.location.search);
      const isValid = params.get('token') === process.env.NEXT_PUBLIC_SECRET_TOKEN;
      setIsAuthorized(isValid);
    };
    checkAuthorization();
  }, []);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleCreateUser = async () => {
    try {
      const result = await createAdminOnChain("1161616161");
      console.log("Result create user", result);
    } catch (err) {
      setError("Failed to create user: " + (err instanceof Error ? err.message : String(err)));
    }
  };

  const handleDeployWallet = async () => {
    try {
      const cachedKey = localStorage.getItem("encryptedPrivateKey");
      const cachedAccountAddress = localStorage.getItem("publicKey");
      if (!cachedKey || !cachedAccountAddress) {
        throw new Error("No cached key or account address found");
      }
      await generateAndDeployNewWalletFromPrivateKey(cachedKey, "secret");
    } catch (err) {
      setError("Failed to deploy wallet: " + (err instanceof Error ? err.message : String(err)));
    }
  };

  const handleCreateEphimeralWallet = async () => {
    try {
      const privateKey = generatePrivateKeyEncrypted("secret");
      const publicKey = getFutureWalletAdressFromPrivateKey(privateKey, "secret");
      const amount = await getEthBalance();
      console.log("Amount", amount);
      const send = await sendEth(publicKey);
      console.log("Send", send);
      const deploy = await generateAndDeployNewWalletFromPrivateKey(
        privateKey,
        "secret"
      );
      const secretForWhiteList = encryptData(publicKey, "secret");
      const secretKeyDecrypted = decryptData(privateKey, "secret");
      await addWhiteList("foo", secretForWhiteList);
      await vote("foo", "1", secretForWhiteList, secretKeyDecrypted, publicKey);
    } catch (err) {
      setError("Failed to create ephimeral wallet: " + (err instanceof Error ? err.message : String(err)));
    }
  };

  const onSubmit = async (data: SuperUserFormData) => {
    try {
      setLoading(true);
      setError('');

      const privateKey = generatePrivateKeyEncrypted(data.password);
      const publicKey = getFutureWalletAdressFromPrivateKey(privateKey, data.password);

      localStorage.setItem("encryptedPrivateKey", privateKey);
      localStorage.setItem("publicKey", publicKey);

      try {
        await generateAndDeployNewWalletFromPrivateKey(privateKey, data.password);
        await createAdminOnChain(data.ine);

        const hashedIne = crypto.createHash("sha256").update(data.ine).digest("hex");

        const response = await fetch('/api/superuser', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: data.email,
            name: data.fullName,
            walletId: publicKey,
            hashIne: hashedIne,
            secretKey: privateKey,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to create superuser in database');
        }

        alert('Superuser created successfully! Please fund the wallet with Sepolia ETH using the faucet: https://starknet-faucet.vercel.app/');
        reset();
      } finally {
        localStorage.removeItem("encryptedPrivateKey");
        localStorage.removeItem("publicKey");
      }
    } catch (err) {
      console.error('Error creating superuser:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while creating superuser');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-gray-100">
        <div className="p-8 bg-gray-800 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-[#f7cf1d]">Access Denied</h1>
          <p className="mt-4">You are not authorized to view this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-black text-gray-100">
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-[#f7cf1d]">
          Secret Admin Panel
        </h1>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="mb-4 p-3 bg-red-900 text-red-100 rounded"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mb-12 space-y-2 md:space-y-0 md:space-x-4 flex flex-col md:flex-row justify-center">
          <Button
            className="bg-[#f7cf1d] text-black hover:bg-[#e5bd0e]"
            onClick={handleDeployWallet}
          >
            <UserPlus className="mr-2 h-4 w-4" /> Deploy Wallet
          </Button>
          <Button
            className="bg-[#f7cf1d] text-black hover:bg-[#e5bd0e]"
            onClick={handleCreateUser}
          >
            <UserPlus className="mr-2 h-4 w-4" /> Create New User
          </Button>
          <Button
            className="bg-[#f7cf1d] text-black hover:bg-[#e5bd0e]"
            onClick={handleCreateEphimeralWallet}
          >
            <UserPlus className="mr-2 h-4 w-4" /> Create Ephimeral Wallet
          </Button>
        </div>

        <div className="max-w-md mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-6 text-[#f7cf1d]">Create Superuser</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
                {...register("email", { 
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address"
                  }
                })}
              />
              {errors.email && (
                <span className="text-red-500 text-sm">{errors.email.message}</span>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Full Name</label>
              <input
                type="text"
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
                {...register("fullName", { 
                  required: "Full name is required",
                  minLength: {
                    value: 3,
                    message: "Name must be at least 3 characters"
                  }
                })}
              />
              {errors.fullName && (
                <span className="text-red-500 text-sm">{errors.fullName.message}</span>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">INE (ID Number)</label>
              <input
                type="text"
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
                {...register("ine", { 
                  required: "INE is required",
                  pattern: {
                    value: /^[0-9]+$/,
                    message: "INE must contain only numbers"
                  }
                })}
              />
              {errors.ine && (
                <span className="text-red-500 text-sm">{errors.ine.message}</span>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
                {...register("password", { 
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters"
                  }
                })}
              />
              {errors.password && (
                <span className="text-red-500 text-sm">{errors.password.message}</span>
              )}
            </div>

            <Button
              type="submit"
              disabled={loading}
              className={`w-full bg-[#f7cf1d] text-black hover:bg-[#e5bd0e] ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Creating...' : 'Create Superuser'}
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}
