import React, { useState } from "react";
import InputAdornment from "@material-ui/core/InputAdornment";
import { useApolloClient, useMutation } from "@apollo/client";
import {
  Button,
  TextField,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { ADD_POSTING } from "../graphql/queries";
import { useField } from "../hooks";
import UploadPhotos from "../components/UploadPhotos";
import UploadedPhotos from "../components/UploadedPhotos";

function NewPosting() {
  const title = useField("text");
  const description = useField("text");
  const price = useField("number");
  const phone = useField("tel");
  const city = useField("text");
  const [urls, setUrls] = useState<string[]>([]);
  const category = useField("radio");
  const [addPosting] = useMutation(ADD_POSTING);
  const condition = useField("radio");
  const history = useHistory();
  const client = useApolloClient();

  const CATEGORIES = ["Fashion", "Electronics", "Health"];
  const CONDITIONS = ["New", "Used"];

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    await addPosting({
      variables: {
        title: title.value,
        category: category.value,
        description: description.value,
        imageUrls: urls,
        price: +price.value,
        condition: condition.value,
        city: city.value,
        phone: +phone.value,
      },
    });
    client.resetStore();
    // TODO push to the posting
    history.push("/");
  }
  return (
    <form onSubmit={handleSubmit}>
      <Typography variant="h3" style={{ margin: "20px" }}>
        Add new posting
      </Typography>
      <TextField fullWidth variant="outlined" label="Title" {...title} />
      <FormControl fullWidth variant="outlined">
        <InputLabel id="category-label">Category</InputLabel>
        {
          // @ts-ignore
          <Select labelId="category-label" id="category" {...category}>
            {CATEGORIES.map((thisCategory) => (
              <MenuItem key={thisCategory} value={thisCategory}>
                {thisCategory}
              </MenuItem>
            ))}
          </Select>
        }
      </FormControl>
      <TextField
        multiline
        fullWidth
        variant="outlined"
        label="Description"
        {...description}
      />
      <TextField
        fullWidth
        variant="outlined"
        label="Price"
        {...price}
        InputProps={{
          startAdornment: <InputAdornment position="start">$</InputAdornment>,
        }}
      />
      <FormControl fullWidth variant="outlined">
        <InputLabel id="category-label">Condition</InputLabel>
        {
          // @ts-ignore
          <Select labelId="condition-label" id="condition" {...condition}>
            {CONDITIONS.map((thisCondition) => (
              <MenuItem key={thisCondition} value={thisCondition}>
                {thisCondition}
              </MenuItem>
            ))}
          </Select>
        }
      </FormControl>
      <TextField fullWidth variant="outlined" label="Phone" {...phone} />
      <TextField fullWidth variant="outlined" label="City" {...city} />
      <UploadPhotos urls={urls} setUrls={setUrls} />
      <UploadedPhotos urls={urls} setUrls={setUrls} />
      <Button color="primary" size="large" variant="contained" type="submit">
        Add
      </Button>
    </form>
  );
}

export default NewPosting;