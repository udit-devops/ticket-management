
import { Search } from "lucide-react";
import Form from "next/form";
function SearchBar() {
    // const router = useRouter();
    // const [query, setQuery]= useState("");


    //   const handleSearch=(e:React.FormEvent)=>{
    //     e.preventDefault();
    //     if (query.trim()) {
    //         router.push(`/search?q=${encodeURIComponent(query.trim())}`)
    //     }
    //   };

    return (
    <div>
      <Form action={"/search"} className="relative">
        <input type="text"
          name="q"
        
          placeholder="Search for events..."
          className="w-full px-8 py-3 bg-white rounded-xl border  border-r-gray-200 shadow-sm focus:outline-none focus:ring-blue-600 focus:ring-2 focus:border-transparent transition-all duration-200"
        
        />

        <Search className="absolute left-1 top-1/2 -translate-y-1/2  text-gray-400 w-5 h-5"/>

        <button 
        type="submit"
        className="absolute right-3 bg-blue-500 hover:bg-blue-700 transition-colors duration-300 top-1/4  rounded-lg font-medium text-white px-2 py-1.5 -translate-y-1 text-sm" 
        >
           Search
        </button>
      </Form>
      </div>
    );
}



export default SearchBar