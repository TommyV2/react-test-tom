import "./styles.css";
import data from "./data/data.js";
import { useState, useEffect } from "react";
import TextField from "@material-ui/core/TextField";
import Asset from "./Asset.js";
import Grid from "@material-ui/core/Grid";
import Chip from "@material-ui/core/Chip";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

export default function App() {
  const [assets, setAssets] = useState([]);
  //tags used for recommendations
  const [tags, setTags] = useState([]);
  const [filter, setFilter] = useState([]);
  const [filterInput, setFilterInput] = useState("");

  useEffect(() => {
    setAssets(data.assets);
  }, []);

  useEffect(() => {
    var newTags = [];
    assets.forEach((asset) => {
      asset.tags.forEach((tag) => {
        if (!newTags.includes(tag.id)) {
          newTags.push(tag.id);
        }
      });
    });
    setTags(newTags);
  }, [assets]);

  function filterAssets() {
    if (filter.length > 0) {
      var visible = [];
      assets.forEach((asset) => {
        var assetTags = [];
        asset.tags.forEach((tag) => {
          assetTags.push(tag.id);
        });
        if (filter.every((v) => assetTags.includes(v))) {
          visible.push(asset);
        }
      });
      return visible;
    }
    return assets;
  }

  function handleFilterInput(e, value) {
    setFilterInput(value);
  }

  function addFilter(e) {
    if (e.keyCode === 13) {
      // on enter
      if (filterInput !== "" && !filter.includes(filterInput)) {
        setFilter([...filter, filterInput]);
        setFilterInput("");
      }
    }
  }
  function removeFilter(id) {
    setFilter((filter) => filter.filter((fil) => fil !== id));
  }

  //handlers for each individual asset
  function addTag(assetToChange, tagToAdd) {
    var newAsset = assetToChange;
    newAsset.tags.push({ id: tagToAdd, text: tagToAdd });
    var idx = assets.findIndex((asset) => asset.title !== assetToChange.title);
    var newAssets = assets.slice();
    newAssets[idx - 1] = newAsset;
    setAssets(newAssets);
  }

  function removeTag(assetToChange, tagToRemove) {
    var newAsset = assetToChange;
    var newTags = newAsset.tags.filter((tag) => tag.id !== tagToRemove);
    newAsset.tags = newTags;
    var idx = assets.findIndex((asset) => asset.title !== assetToChange.title);
    var newAssets = assets.slice();
    newAssets[idx - 1] = newAsset;
    setAssets(newAssets);
  }
  //draggable list

  return (
    <div className="App">
      <h4 className="main">Add tags to filter:</h4>
      <Autocomplete
        freeSolo
        id="free-solo-2-demo"
        style={{ width: 300, marginLeft: "30%" }}
        disableClearable
        options={tags}
        onChange={handleFilterInput}
        disableListWrap={true}
        autoHighlight={true}
        autoFocus={true}
        renderInput={(params) => (
          <TextField
            {...params}
            id="filter"
            label="Add new tag"
            margin="normal"
            variant="outlined"
            InputProps={{ ...params.InputProps, type: "search" }}
            value={filterInput}
            onKeyDown={addFilter}
          />
        )}
      />
      <br />
      <br />
      <DragDropContext>
        <Droppable droppableId="characters">
          {(provided) => (
            <Grid
              className="container"
              container
              spacing={1}
              direction="row"
              justifyContent="flex-start"
              alignItems="center"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {filter.map((tag, index) => {
                return (
                  <Draggable key={tag} draggableId={tag} index={index}>
                    {(provided) => (
                      <Grid
                        item
                        sm={1.5}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <Chip label={tag} onDelete={() => removeFilter(tag)} />
                      </Grid>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </Grid>
          )}
        </Droppable>
      </DragDropContext>
      <br />
      <br />
      <Grid
        className="container"
        container
        spacing={1}
        direction="row"
        justifyContent="flex-start"
      >
        {filterAssets().map((asset) => (
          <Grid key={asset.title + asset.tags.length} item sm={4}>
            <Asset addTag={addTag} removeTag={removeTag} data={asset} />
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
