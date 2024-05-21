import { useContext, useEffect, useRef, useState, useMemo } from "react";
import { Box, Button, Card, CardContent, Link, Typography } from "@mui/material";
import { ElasticSearchContext } from "@/app/contexts/ElasticSearchContext";
import { descriptionField, displayFields, titleFields } from "@/app/filterFields";

export function ElasticCard({ data }) {
  const { search } = useContext(ElasticSearchContext);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const ref = useRef();

  useEffect(() => {
      console.log("rendered")
    const checkOverflow = () => {
      if (ref.current) {
        setIsOverflowing(ref.current.scrollHeight > ref.current.offsetHeight);
      }
    };
    checkOverflow();
  }, [data]);
const highlightedText = data[descriptionField]
  // const highlightedText = useMemo(() => {
  //   if (!data[descriptionField]) return "";
  //
  //   const description = data[descriptionField];
  //   const searchTerm = search.toLowerCase();
  //   const index = description.toLowerCase().indexOf(searchTerm);
  //   if (index !== -1) {
  //     const trimmedText = index > 0 ? '...' + description.substring(index) : description;
  //     const parts = trimmedText.split(new RegExp(`(${searchTerm})`, 'gi'));
  //     return (
  //           <>
  //             {parts.map((part, i) => (
  //                   <span key={i} style={part.toLowerCase() === searchTerm ? { backgroundColor: 'yellow' } : {}}>
  //             {part}
  //           </span>
  //             ))}
  //           </>
  //     );
  //   } else {
  //     return data[descriptionField];
  //   }
  // }, [data, search]);

  return (
        <Card sx={{ boxShadow: 3 }} className="border border-gray-200">
          <CardContent>
            <Link className="cursor-pointer" href={data.url}>
              <Typography gutterBottom variant="h5" component="div" sx={{ fontWeight: "bold" }}>
                {data[titleFields]}
              </Typography>
            </Link>
            {displayFields.map((field) => (
                  <DisplayData
                        arrayOfData={data[field.arrayOfData]}
                        name={field.uiName}
                        extra={data[field.extra]}
                        key={field.uiName}
                  />
            ))}

            <Box
                  ref={ref}
                  className="max-h-fit"
                  sx={{
                    height: isExpanded ? "auto" : 150,
                    overflow: "hidden",
                    position: "relative",
                    transition: "height 0.5s",
                  }}
            >
              <Typography variant="body1" color="text.secondary">
                {highlightedText}
              </Typography>
              {!isExpanded && isOverflowing && (
                    <Box
                          sx={{
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            right: 0,
                            height: "2em",
                            backgroundImage: "linear-gradient(to top, white, transparent)",
                          }}
                    />
              )}
            </Box>
            {isOverflowing && (
                  <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <Button variant="text" color="primary" onClick={() => setIsExpanded(!isExpanded)}>
                      Read {isExpanded ? "Less" : "More"}
                    </Button>
                  </Box>
            )}
          </CardContent>
        </Card>
  );
}

export function DisplayData({ arrayOfData, extra, name }) {
  return (
        <Typography variant="body1" color="text.secondary" className="mb-3">
          <span className="font-bold">{name} </span>
          {Array.isArray(arrayOfData) && arrayOfData.length > 0 ? (
                <span>
          {arrayOfData.join(", ")} {extra && "- " + extra}
        </span>
          ) : (
                "None"
          )}
        </Typography>
  );
}
