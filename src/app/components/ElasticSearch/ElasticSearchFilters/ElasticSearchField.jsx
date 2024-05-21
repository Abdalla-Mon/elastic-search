import {Button, FormControl, IconButton, TextField} from "@mui/material";
import { ElasticSearchContext } from "@/app/contexts/ElasticSearchContext";
import { useContext, useRef } from "react";

export default function ElasticSearchField() {
    const { setSearch } = useContext(ElasticSearchContext);
    const inputRef = useRef();

    return (
          <div className="flex gap-5 items-center">
              <FormControl
              className={"relative w-full"}
              >

              <TextField
                    inputRef={inputRef}
                    id="outlined-basic"
                    label="Search"
                    variant="filled"
                    fullWidth
              />
                  <IconButton
                        onClick={() => {
                            inputRef.current.value = "";
                            setSearch("");
                        }}

                        className={"absolute right-0 top-1/2 transform -translate-y-1/2 w-[50px] h-[50px]   text-xl  bg-white hover:bg-gray-200"}
                  >

                      X
                  </IconButton>
              </FormControl>
              <Button
                    onClick={() => {
                        if(inputRef.current.value.trim() === "") {
                            setSearch("");
                            return;
                        }
                        const searchValue = inputRef.current.value.trim();
                        setSearch(searchValue);
                    }}
                    className="py-3 bg-blue-500 text-white px-5 hover:bg-blue-400"
              >
                  Search
              </Button>
          </div>
    );
}
