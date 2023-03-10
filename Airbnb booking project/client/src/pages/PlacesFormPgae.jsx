import { useEffect, useState } from "react";
import axios from "axios";
import { PhotosUploader } from "../PhotosUploader";
import Perks from "../Perks";
import { AccountNav } from "../AccountNav";
import { Navigate, useParams } from "react-router-dom";
export default function PlacesFormPage(){
    const {id} = useParams();
    const [title, setTtile] = useState('');
    const [address, setSAddress] = useState('');
    const [addedPhotos, setAddedPhotos] = useState([]);
    const [description, setDescription] = useState('');
    const [perks, setPerks] = useState([]);
    const [extraInfo, setExtraInfo] = useState('');
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [maxGuests, setMaxGuests] = useState(1);
    const [redirect, setRedirect] = useState(false);
    useEffect(() =>{

    },[]);
    function inputHeader(text){
        return(
            <h2 className="text-2xl mt-4">{text}</h2>
        );
    }
    function inputDescription(text){
        return(
            <p className="text-gray-500 text-sm">{text}</p>
        );
    }
    function preInput(header,description){
        return(
            <>
            {inputHeader(header)}
            {inputDescription(description)}
            </>
        );
    }

    async function addNewPlace(ev){
        ev.preventDefault();
       const {data} = await axios.post('/places', {title, address, addedPhotos,
        description, perks, extraInfo, 
        checkIn, checkOut, maxGuests});
        setRedirect(true);
    }

    if(redirect){
        return <Navigate to={'/account/places'}/>
    }
    return(
        <div>
            <AccountNav />
            <form onSubmit={addNewPlace}>
                {preInput('Title','Title for your place, should be short and catchy as the advertisement')}
                <input type='text' value={title} onChange={ev => setTtile(ev.target.value)} placeholder="title, for example my lovely appartment"/>
                {preInput('Address','Address to your place')}
                <input type='text' value={address} onChange={ev => setSAddress(ev.target.value)} placeholder="address"/>
                {preInput('Photos','more = better')}
                <PhotosUploader addedPhotos={addedPhotos} onChange={setAddedPhotos}/>
                {preInput('Description','description of the place')}
                <textarea value={description} onChange={ev =>setDescription(ev.target.value)}/>
                {preInput('Perks','Select all the perks of your place')}
                <div className="grid grid-cols-2 mt-2 md:grid-cols-3 lg:grid-cols-3 gap-2">
                    <Perks selected={perks} onChange={setPerks} />
                </div>
                {preInput('Extra info','house rules, etc')}
                <textarea value={extraInfo} onChange={ev =>setExtraInfo(ev.target.value)} />
                {preInput('Check in and check out time','Add check in and check out times, remember to have some time window to clean the room between guests')}
                <div className="grid sm:grid-cols-3 gap-2">
                    <div>
                        <h3 className="mt-2 -mb-1">Check in time</h3>
                        <input type='text' value={checkIn} onChange={ev => setCheckIn(ev.target.value)} placeholder="14"/>
                    </div>
                    <div>
                    <h3>Check out time</h3>
                        <input type='text' value={checkOut} onChange={ev => setCheckOut(ev.target.value)} placeholder="11"/>
                    </div>
                    <div>
                    <h3>Max number of guests</h3>
                        <input type='number' value={maxGuests} onChange={ev => setMaxGuests(ev.target.value)}/>
                    </div>
                </div>
                <div>
                    <button className="primary my-4">Save</button>
                </div>
            </form>
        </div>
    );
}