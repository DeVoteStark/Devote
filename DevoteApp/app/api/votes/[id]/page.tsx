'use client';
import {ProposalWithFile} from '../../../../components/../interfaces/Proposal';
import {useEffect, useState} from 'react';
import {useParams} from 'next/navigation';

export default function ProposalPage(){
    const params= useParams();
    const [proposal,setProposal] = useState<ProposalWithFile| null>(null);

    useEffect(()=>{
        async function fetchProposal(){
            const res= await fetch(`/api/proposals?id=${params.id}`);
            const data= await res.json();
            setProposal(data);
        }
        fetchProposal();
    },[params.id]);

    if(!proposal) return <p>Loading...</p>

    return(
        <div>
            <h1>{proposal.name}</h1>
            <p>Total Voters: {proposal.total_voters}</p>
            {proposal.file && (
            <a href={proposal.file} target="_blank" rel="noopener noreferrer">
                View File
            </a>
            )}
        </div>
    );
}

