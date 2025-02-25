"use client";

import { useEffect, useState } from "react";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useContractCustom } from "@/hooks/use-contract";
import { ProposalPublic, ProposalVoteTypeStruct } from "@/interfaces/Proposal";
import { useParams } from "next/navigation";
import { useAccount } from "@starknet-react/core";
import AIAgent from "@/app/components/AIAgent";
import {
  decryptData,
  encryptData,
  generateAndDeployNewWalletFromPrivateKey,
  generatePrivateKeyEncrypted,
  getFutureWalletAdressFromPrivateKey,
} from "@/lib/starknet/createWallet";
import { useEth } from "@/hooks/use-eth";
import { useWallet } from "@/hooks/use-wallet";
import { loginStatus } from "@/interfaces/Login";

export default function VotingStationPage() {
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [proposal, setProposal] = useState<ProposalPublic>();
  const { getProposal, vote, addWhiteList } = useContractCustom();
  const { getEthBalance, sendEth } = useEth();
  const [votingOptions, setVotingOptions] = useState<ProposalVoteTypeStruct[]>(
    []
  );
  const params = useParams<{ id: string }>();
  const { connectionStatus, address } = useWallet();

  useEffect(() => {
    const fetchData = async () => {
      if (!!address && connectionStatus === loginStatus.CONNECTED) {
        const proposal = await getProposal(params.id, address);
        setVotingOptions(proposal.type_votes);
        console.log("Proposal", proposal);
        setProposal(proposal);
      }
    };
    fetchData();
  }, [params.id, address, connectionStatus]);

  const handleVote = async () => {
    if (selectedOption && params.id) {
      const privateKey = generatePrivateKeyEncrypted("secret");
      const publicKey = getFutureWalletAdressFromPrivateKey(
        privateKey,
        "secret"
      );
      const amount = await getEthBalance();
      console.log("Amount", amount);
      const send = await sendEth(publicKey);
      console.log("Send", send);
      const deploy = await generateAndDeployNewWalletFromPrivateKey(
        privateKey,
        "secret"
      );
      const secretForWhiteList = encryptData(privateKey, "secret").substring(
        0,
        15
      );
      const secretKeyDecrypted = decryptData(privateKey, "secret");
      const resWhiteList = await addWhiteList(params.id, secretForWhiteList);
      console.log("WhiteList", resWhiteList);
      const resVote = await vote(
        params.id,
        selectedOption,
        secretForWhiteList,
        secretKeyDecrypted,
        publicKey
      );
      console.log("Vote", resVote);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-black text-gray-100">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-[#f7cf1d]">
          {proposal?.name}
        </h1>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="grid gap-6 md:grid-cols-1">
              <Card className="bg-gray-900 border-[#f7cf1d] max-w-2xl mx-auto">
                <CardHeader>
                  <CardTitle className="text-[#f7cf1d]">
                    Cast Your Vote
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Choose your preferred option for {proposal?.name} project
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {proposal?.voter?.has_voted ? (
                    <div className="text-center py-8">
                      <h2 className="text-2xl font-bold text-[#f7cf1d] mb-4">
                        Thank you for voting!
                      </h2>
                      <p className="text-gray-300">
                        Your vote has been recorded successfully.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <RadioGroup
                        value={selectedOption}
                        onValueChange={setSelectedOption}
                      >
                        {votingOptions.map((option) => (
                          <div
                            key={option.vote_type}
                            className="flex items-center space-x-2"
                          >
                            <RadioGroupItem
                              value={option.vote_type.toString()}
                              id={option.vote_type.toString()}
                              className="border-[#f7cf1d] text-[#f7cf1d]"
                            />
                            <Label
                              htmlFor={option.vote_type.toString()}
                              className="text-gray-200 cursor-pointer"
                            >
                              {option.vote_type}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                      <Button
                        onClick={handleVote}
                        disabled={!selectedOption}
                        className="w-full bg-[#f7cf1d] text-black hover:bg-[#e5bd0e] disabled:opacity-50"
                      >
                        Submit Vote
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
          <div className="lg:col-span-1">
            {proposal && <AIAgent proposalId={proposal.id} />}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
