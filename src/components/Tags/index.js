import React from "react";
import Badge from "react-bootstrap/Badge";

export default function Tags(props) {
  const tagList = props.tags.slice(0, Math.min(props.tags.length, 40)).map((tag) => {
      return <Badge pill variant="dark" onClick ={()=>{props.keywordChange(tag)}}>
          {tag}
      </Badge>
  });
  return (
      <div>{tagList}</div>
  )
}
