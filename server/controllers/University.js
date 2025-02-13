import UniversityModel from "../models/University.js"

export const CreateUniversity=async (req,res)=>{
    try 
    {
        const univData=await UniversityModel.create({
            name:req.body.name,
            image:req?.file?.filename,
        });
        if(univData)res.status(201).send({message:"University Created"})
        else res.status(404).send({message:"Unable to create university"});
    }
    catch(e){
        res.status(404).send({error:e?.message});
    }
}



export const updateUniversity=async (req,res)=>{
    try 
    {
        const univData=await UniversityModel.findByIdAndUpdate({
            _id:req.body._id
        },
        {
            name:req.body.name,
            image:req?.file?.filename,
        });
        if(univData)res.status(201).send({message:"University Updated"})
        else res.status(404).send({message:"Unable to update university"});
    }
    catch(e){
        res.status(404).send({error:e?.message});
    }
}


export const deleteUniversity=async (req,res)=>{
    try 
    {
        const univData=await UniversityModel.deleteOne({
            _id:req.body._id}
            );
        if(univData.deletedCount==1)
        res.status(201).send({message:"University deleted"})
        else res.status(404).send({message:"Unable to delete university"});
    }
    catch(e){
        res.status(404).send({error:e?.message});
    }
}


export const GetUniversities=async (req,res)=>
{
    try
    {
        const univData=await UniversityModel.find();
        res.status(200).send({univData});
    }
    catch(e)
    {
        res.status(404).send({error:e?.message});
    }
};

