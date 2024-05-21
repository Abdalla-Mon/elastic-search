import {useRef, useState} from "react";
import {Box, Chip, CircularProgress, TextField, Typography} from "@mui/material";
import {handleFilterFetch} from "@/app/actions/filter";


export default function CustomFilterInput({customData}) {
    const [data,setData] = useState([]);
    const [loading,setLoading] = useState(false);
    const [focus,setFocus] = useState(false);
    const [selected,setSelected] = useState([]);
    const inputRef = useRef(null);
async function handleFocus(){
    setFocus(true)
    setLoading(true)
    const filters=await handleFilterFetch();
    console.log()
    setData(filters)
    setLoading(false)
    }

function handleInputChange(value){

    const filters=customData.filter((item)=>{
        return item.toLowerCase().includes(value.toLowerCase())
    })
    setData(filters)
}
    return(
          <div
          className={"relative w-full"}
          >

              <RenderChips selected={selected} setSelected={setSelected}/>
              <TextField  id="outlined-basic" label="Search" variant="filled" fullWidth
                          onFocus={()=>handleFocus()}
                          onBlur={()=>setFocus(false)}
                          inputRef={inputRef}
                          onChange={(e)=>handleInputChange(e.target.value)}
              />
              {focus&&
<FilterContainer data={data} loading={loading} value={inputRef.current.value}  setSelected={setSelected}/>
              }
          </div>
    )
}
function FilterContainer({ data, loading ,value,setSelected}) {
    function handleClick(item){
        setSelected([...selected,item])
    }
    return (
          <Box className="p-4 bg-white rounded shadow absolute w-full left-0 top-[50px]">
              {data.length === 0 && !loading && (

                    <Typography>No data found</Typography>
                )
                }
              {loading ? (
                    <Box className="flex justify-center items-center space-x-2">
                        <CircularProgress />
                        <Typography>Loading...</Typography>
                    </Box>
              ) : (
                    data.map((item, index) => (
                          <Typography key={index} className="mb-2 cursor-pointer hover:text-blue-500"
                          onClick={()=>handleClick(item)}

                          >
                              {item}
                          </Typography>
                    ))
              )}
          </Box>
    );
}
function RenderChips({selected,setSelected}){
    return(
          <Box className={"w-full "}>

              {selected.map((item, index) => (
                    <Chip
                          variant="outlined"
                          label={item}
                          onDelete={() => setSelected(selected.filter((_, i) => i !== index))}
                          key={item + index}
                    />
              ))}
          </Box>
    )
}