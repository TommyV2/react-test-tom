import "./styles.css";
import { useState, useEffect } from "react";
import TextField from "@material-ui/core/TextField";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Chip from "@material-ui/core/Chip";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: "sm"
  },
  image: {
    height: 200,
    width: 200
  },
  media: {
    height: "50px",
    paddingTop: "56.25%" // 16:9
  },
  tag: {
    textAlign: "left",
    marginRight: "0%",
    display: "inline"
  }
}));

export default function Asset(props) {
  const classes = useStyles();
  const [asset] = useState(props.data);
  const [tags, setTags] = useState([]);
  const [filterInput, setFilterInput] = useState("");

  useEffect(() => {
    var newTags = [];
    asset.tags.forEach((tag) => {
      newTags.push(tag.id);
    });
    setTags(newTags);
  }, [asset.tags]);

  function handleFilterInput(e) {
    setFilterInput(e.target.value);
  }

  function add(e) {
    if (e.keyCode === 13) {
      // on enter
      if (filterInput !== "" && !asset.tags.includes(filterInput)) {
        props.addTag(asset, filterInput);
        setFilterInput("");
      }
    }
  }
  return (
    <Card variant="outlined">
      <Typography variant="h6">{asset.title}</Typography>
      <CardMedia className={classes.media} image={asset.url} />
      <TextField
        id="filter"
        label="Add tag"
        value={filterInput}
        onChange={handleFilterInput}
        onKeyDown={add}
      />
      <br />
      <DragDropContext>
        <Droppable droppableId="characters">
          {(provided) => (
            <CardContent
              {...provided.droppableProps}
              ref={provided.innerRef}
              direction="row"
              className={classes.tag}
            >
              {tags.map((tag, index) => {
                return (
                  <Draggable key={tag + asset} draggableId={tag} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        item
                        xs={4}
                      >
                        <Chip
                          size="small"
                          label={tag}
                          onDelete={() => props.removeTag(asset, tag)}
                        />
                      </div>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </CardContent>
          )}
        </Droppable>
      </DragDropContext>
    </Card>
  );
}
