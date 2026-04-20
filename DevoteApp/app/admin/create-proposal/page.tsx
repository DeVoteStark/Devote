const handleSubmit= async (e:React.FormEvent)=>{
    e.preventDefault();
    const formData= new FormData(e.target as HTMLFormElement);
    const res= await fetch('/api/proposals', {method: 'POST', body:formData});
    const data=await res.json();
    console.log('Proposal uploaded:', data);
}