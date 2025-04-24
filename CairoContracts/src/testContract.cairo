#[starknet::interface]
trait ItestContract<ContractState> {
    fn add_global_counter(ref self: ContractState);
    fn add_key_counter(ref self: ContractState, key: felt252);
    fn get_global_counter(ref self: ContractState) -> u8;
    fn get_key_counter(ref self: ContractState, key: felt252) -> u8;
    fn get_wallet_counter(ref self: ContractState) -> u8;
}
#[starknet::contract]
mod testContract {
    use super::ItestContract;
    use starknet::storage::{
        StoragePointerReadAccess, StoragePointerWriteAccess, Map, StoragePathEntry,
    };
    use core::starknet::{ContractAddress, get_caller_address};
    #[storage]
    struct Storage {
        global_counter: u8,
        key_counter: Map<felt252, u8>,
        wallet_counter: Map<ContractAddress, u8>,
    }

    #[abi(embed_v0)]
    impl testContractImpl of ItestContract<ContractState> {
        fn add_global_counter(ref self: ContractState) {
            self.global_counter.write(self.global_counter.read() + 1);
            let wallet_counter = self.wallet_counter.entry(get_caller_address());
            wallet_counter.write(wallet_counter.read() + 1);
        }

        fn add_key_counter(ref self: ContractState, key: felt252) {
            let counter = self.key_counter.entry(key);
            counter.write(counter.read() + 1);
            let wallet_counter = self.wallet_counter.entry(get_caller_address());
            wallet_counter.write(wallet_counter.read() + 1);
        }

        fn get_global_counter(ref self: ContractState) -> u8 {
            self.global_counter.read()
        }

        fn get_key_counter(ref self: ContractState, key: felt252) -> u8 {
            self.key_counter.entry(key).read()
        }

        fn get_wallet_counter(ref self: ContractState) -> u8 {
            let caller = get_caller_address();
            self.wallet_counter.entry(caller).read()
        }
    }
}
