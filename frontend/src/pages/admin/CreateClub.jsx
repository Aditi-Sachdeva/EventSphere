import { useState, useRef, useEffect } from "react";
import { Users, Plus, Search, X, ChevronDown, AlertCircle } from "lucide-react";

const Icon = ({ name, className }) => {
  const icons = {
    plus: Plus,
    search: Search,
    close: X,
    chevron: ChevronDown,
    warn: AlertCircle,
    users: Users
  };

  const LucideIcon = icons[name];
  if (!LucideIcon) return null;

  return <LucideIcon className={className} />;
};

const AVATAR_COLORS = [
  "bg-violet-500","bg-fuchsia-500","bg-indigo-500","bg-purple-500",
  "bg-pink-500","bg-sky-500","bg-teal-500","bg-orange-400",
];

const DUMMY_ORGANIZERS = [
  { id:1,name:"Aanya Sharma",email:"aanya.sharma@gmail.com",avatar:"AS",role:"Admin"},
  { id:2,name:"Rohan Mehta",email:"rohan.mehta@outlook.com",avatar:"RM",role:"Organizer"},
  { id:3,name:"Priya Nair",email:"priya.nair@yahoo.com",avatar:"PN",role:"User"},
  { id:4,name:"Dev Kapoor",email:"dev.kapoor@gmail.com",avatar:"DK",role:"Organizer"},
  { id:5,name:"Simran Kaur",email:"simran.kaur@hotmail.com",avatar:"SK",role:"User"},
  { id:6,name:"Neha Joshi",email:"neha.joshi@gmail.com",avatar:"NJ",role:"Organizer"},
  { id:7,name:"Karan Singh",email:"karan.singh@icloud.com",avatar:"KS",role:"User"},
  { id:8,name:"Meera Pillai",email:"meera.pillai@gmail.com",avatar:"MP",role:"Admin"},
  { id:9,name:"Tanya Gupta",email:"tanya.gupta@gmail.com",avatar:"TG",role:"User"},
  { id:10,name:"Amit Chatterjee",email:"amit.chatt@gmail.com",avatar:"AC",role:"Organizer"},
];

/* ============================= */
/* ORGANIZER SELECT COMPONENT    */
/* ============================= */

function OrganizerSelect({ value, onChange }) {

  const [open,setOpen] = useState(false);
  const [search,setSearch] = useState("");
  const ref = useRef();
  const inputRef = useRef();

  useEffect(()=>{
    const h=(e)=>{
      if(ref.current && !ref.current.contains(e.target))
        setOpen(false);
    };
    document.addEventListener("mousedown",h);
    return ()=>document.removeEventListener("mousedown",h);
  },[]);

  useEffect(()=>{
    if(open && inputRef.current) inputRef.current.focus();
  },[open]);

  const filtered = DUMMY_ORGANIZERS.filter((u)=>{
    const q = search.toLowerCase();
    return (
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q)
    );
  });

  const selected = DUMMY_ORGANIZERS.find((u)=>u.id===value) || null;

  return (
    <div className="relative" ref={ref}>

      {/* SELECT BOX */}

      <button
        type="button"
        onClick={()=>setOpen(!open)}
        className="w-full border rounded-lg px-3 py-2 flex items-center justify-between bg-white"
      >
        {selected ? (
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 text-white flex items-center justify-center rounded-full ${AVATAR_COLORS[selected.id % AVATAR_COLORS.length]}`}>
              {selected.avatar}
            </div>
            <div className="text-left">
              <div className="text-sm font-medium">{selected.name}</div>
              <div className="text-xs text-gray-500">{selected.email}</div>
            </div>
          </div>
        ) : (
          <span className="text-gray-400">Select organizer</span>
        )}

        <Icon name="chevron" className="w-4 h-4 text-gray-500"/>
      </button>

      {/* DROPDOWN */}

      {open && (
        <div className="absolute mt-2 w-full bg-white border rounded-lg shadow-lg z-50">

          {/* SEARCH */}

          <div className="flex items-center border-b px-2 py-2">
            <Icon name="search" className="w-4 h-4 text-gray-400 mr-2"/>
            <input
              ref={inputRef}
              value={search}
              onChange={(e)=>setSearch(e.target.value)}
              placeholder="Search..."
              className="w-full outline-none text-sm"
            />
          </div>

          {/* OPTIONS */}

          <div className="max-h-60 overflow-y-auto">
            {filtered.map((u)=>(
              <div
                key={u.id}
                onClick={()=>{
                  onChange(u.id);
                  setOpen(false);
                }}
                className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer"
              >
                <div className={`w-8 h-8 text-white flex items-center justify-center rounded-full ${AVATAR_COLORS[u.id % AVATAR_COLORS.length]}`}>
                  {u.avatar}
                </div>

                <div>
                  <div className="text-sm font-medium">{u.name}</div>
                  <div className="text-xs text-gray-500">{u.email}</div>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

    </div>
  );
}


/* ============================= */
/* CREATE CLUB PAGE COMPONENT    */
/* ============================= */

export default function CreateClub(){

  const [name,setName] = useState("");
  const [description,setDescription] = useState("");
  const [organizerId,setOrganizerId] = useState(null);
  const [errors,setErrors] = useState({});
  const [success,setSuccess] = useState(false);

  const validate=()=>{
    const e={};

    if(!name.trim() || name.length<3)
      e.name="Club name must be at least 3 characters.";

    if(!description.trim() || description.length<10)
      e.description="Description must be at least 10 characters.";

    if(!organizerId)
      e.organizer="Please select an organizer.";

    return e;
  };

  const handleSubmit=(e)=>{
    e.preventDefault();

    const errs = validate();

    if(Object.keys(errs).length>0){
      setErrors(errs);
      return;
    }

    setErrors({});
    setSuccess(true);

    setTimeout(()=>{
      setName("");
      setDescription("");
      setOrganizerId(null);
      setSuccess(false);
    },3000);
  };

  const handleReset=()=>{
    setName("");
    setDescription("");
    setOrganizerId(null);
    setErrors({});
    setSuccess(false);
  };

  return (

    <div className="p-6 max-w-2xl">

      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Icon name="users" className="w-6 h-6"/>
        Create Club
      </h1>

      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
          Club created successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* CLUB NAME */}

        <div>
          <label className="block text-sm font-medium mb-1">
            Club Name
          </label>

          <input
            value={name}
            onChange={(e)=>setName(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
            placeholder="Enter club name"
          />

          {errors.name && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
              <Icon name="warn" className="w-4 h-4"/>
              {errors.name}
            </p>
          )}
        </div>

        {/* DESCRIPTION */}

        <div>
          <label className="block text-sm font-medium mb-1">
            Description
          </label>

          <textarea
            value={description}
            onChange={(e)=>setDescription(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
            rows={4}
            placeholder="Enter club description"
          />

          {errors.description && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
              <Icon name="warn" className="w-4 h-4"/>
              {errors.description}
            </p>
          )}
        </div>

        {/* ORGANIZER */}

        <div>
          <label className="block text-sm font-medium mb-1">
            Organizer
          </label>

          <OrganizerSelect
            value={organizerId}
            onChange={setOrganizerId}
          />

          {errors.organizer && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
              <Icon name="warn" className="w-4 h-4"/>
              {errors.organizer}
            </p>
          )}
        </div>

        {/* BUTTONS */}

        <div className="flex gap-3 pt-2">

          <button
            type="submit"
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
          >
            <Icon name="plus" className="w-4 h-4"/>
            Create Club
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 border rounded-lg hover:bg-gray-100"
          >
            Reset
          </button>

        </div>

      </form>

    </div>
  );
}