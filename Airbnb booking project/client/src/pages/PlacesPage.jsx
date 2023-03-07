import axios from "axios";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import Perks from "../Perks";
export default function PlacesPage(){
    const {action} = useParams();
    const [title, setTtile] = useState('');
    const [address, setSAddress] = useState('');
    const [addedPhotos, setAddedPhotos] = useState([]);
    const [photoLink, setPhotoLink] = useState('');
    const [description, setDescription] = useState('');
    const [perks, setPerks] = useState([]);
    const [extraInfo, setExtraInfo] = useState('');
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [maxGuests, setMaxGuests] = useState(1);
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
    async function addPhotoByLink(ev){
        ev.preventDefault();
       const {data:fileName} = await axios.post('/upload-by-link', {link: photoLink});
       setAddedPhotos(prev => {
        return [...prev, fileName];
       });
       setPhotoLink('');
    }

     function uploadPhoto(ev){
        const files = ev.target.files;
        const data = new FormData();
        for(let i=0;i<files.length;i++){
            data.append('photos', files[i]);
        }
         axios.post('/upload', data,{
            headers: {'Content-Type':'multipart/form-data'}
        }).then(response =>{
            const {data:filenames} = response;
            setAddedPhotos(prev => {
                return [...prev, ...filenames];
               });
            
        });
    }
    return (
        <div>
            {action !== 'new' &&(
                <div classNasme="text-center"> 
                <Link className="inline-flex gap-1 bg-primary text-white py-2 px-6 rounded-full" to={'/account/places/new'}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                 <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
    
                Add new place
                </Link>
            </div>

            )}
            {action === 'new' &&(
                <div>
                    <form>
                        {preInput('Title','Title for your place, should be short and catchy as the advertisement')}
                        <input type='text' value={title} onChange={ev => setTtile(ev.target.value)} placeholder="title, for example my lovely appartment"/>
                        {preInput('Address','Address to your place')}
                        <input type='text' value={address} onChange={ev => setSAddress(ev.target.value)} placeholder="address"/>
                        {preInput('Photos','more = better')}
                        <div className="flex gap-2">
                            <input
                             value={photoLink} 
                             onChange={ev =>setPhotoLink(ev.target.value)}
                             type='text' placeholder={'Adding more using the link...jpg'}/>
                            <button onClick={addPhotoByLink} className="bg-gray-200 px-4 rounded-2xl">Add photo</button>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-2 lg:grid-cols-6 md:grid-cols-4 mt-2">
                            {addedPhotos.length >0 && addedPhotos.map(link => (
                                <div className="h-32 flex">
                                    <img className="rounded-2xl w-full object-cover" src={'http://localhost:4000/uploads/'+link} alt="" />
                                </div>   
                            ))}
                            <label className="h-32 cursor-pointer flex items-center gap-1 justify-center border bg-transparent rounded-2xl p-2 text-2xl text-gray-600">
                            <input type='file' multiple className="hidden" onChange={uploadPhoto} />
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15m0-3l-3-3m0 0l-3 3m3-3V15" />
                            </svg>

                             Upload    
                            </label>
                        </div>
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
            )}
        </div>
    );
}