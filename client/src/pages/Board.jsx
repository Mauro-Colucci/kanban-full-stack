import {
  DeleteOutlined,
  StarBorderOutlined,
  StarOutlined,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Divider,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import boardApi from "../api/boardApi";
import EmojiPicker from "../components/common/EmojiPicker";
import Kanban from "../components/common/Kanban";
import { setBoards } from "../state/boardSlice";
import { setFavoriteList } from "../state/favoriteSlice";

let timer;
const timeout = 500;

const Board = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { boardId } = useParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [sections, setSections] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [icon, setIcon] = useState("");

  const boards = useSelector((state) => state.board.value);
  const favoriteList = useSelector((state) => state.favorite.value);

  useEffect(() => {
    const getBoard = async () => {
      try {
        const res = await boardApi.getOne(boardId);
        setTitle(res.title);
        setDescription(res.description);
        setSections(res.sections);
        setIsFavorite(res.favorite);
        setIcon(res.icon);
      } catch (err) {
        alert(err.data?.errors[0]?.msg);
      }
    };
    getBoard();
  }, [boardId]);

  const onIconChange = async (newIcon) => {
    let temp = [...boards];
    const index = temp.findIndex((ele) => ele.id === boardId);
    temp[index] = { ...temp[index], icon: newIcon };

    if (isFavorite) {
      let tempfavorite = [...favoriteList];
      const favoriteIndex = tempfavorite.findIndex((ele) => ele.id === boardId);
      tempfavorite[favoriteIndex] = {
        ...tempfavorite[favoriteIndex],
        icon: newIcon,
      };
      dispatch(setFavoriteList(tempfavorite));
    }

    setIcon(newIcon);
    dispatch(setBoards(temp));
    try {
      await boardApi.update(boardId, { icon: newIcon });
    } catch (err) {
      alert(err);
    }
  };

  const titleChange = (e) => {
    clearTimeout(timer);
    const newTitle = e.target.value;
    setTitle(newTitle);
    let temp = [...boards];
    const index = temp.findIndex((ele) => ele.id === boardId);
    temp[index] = { ...temp[index], title: newTitle };
    if (isFavorite) {
      let tempFavorite = [...favoriteList];
      const favoriteIndex = tempFavorite.findIndex((e) => e.id === boardId);
      tempFavorite[favoriteIndex] = {
        ...tempFavorite[favoriteIndex],
        title: newTitle,
      };
      dispatch(setFavoriteList(tempFavorite));
    }
    dispatch(setBoards(temp));
    timer = setTimeout(async () => {
      try {
        await boardApi.update(boardId, { title: newTitle });
      } catch (err) {
        alert(err);
      }
    }, timeout);
  };

  const descriptionChange = (e) => {
    clearTimeout(timer);
    const newDesc = e.target.value;
    setDescription(newDesc);
    timer = setTimeout(async () => {
      try {
        await boardApi.update(boardId, { description: newDesc });
      } catch (err) {
        alert(err);
      }
    }, timeout);
  };

  const addfavorite = async () => {
    try {
      const board = await boardApi.update(boardId, { favorite: !isFavorite });
      let newfavoriteList = [...favoriteList];
      if (isFavorite) {
        newfavoriteList = newfavoriteList.filter((ele) => ele.id !== boardId);
      } else {
        newfavoriteList.unshift(board);
      }
      dispatch(setFavoriteList(newfavoriteList));
      setIsFavorite(!isFavorite);
    } catch (err) {
      alert(err);
    }
  };

  const deleteBoard = async () => {
    try {
      await boardApi.delete(boardId);
      if (isFavorite) {
        const newFavouriteList = favoriteList.filter(
          (ele) => ele.id !== boardId
        );
        dispatch(setFavoriteList(newFavouriteList));
      }

      const newList = boards.filter((ele) => ele.id !== boardId);
      if (newList.length === 0) {
        navigate("/boards");
      } else {
        navigate(`/boards/${newList[0].id}`);
      }
      dispatch(setBoards(newList));
    } catch (err) {
      alert(err);
    }
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <IconButton variant="outlined" onClick={addfavorite}>
          {isFavorite ? (
            <StarOutlined color="warning" />
          ) : (
            <StarBorderOutlined />
          )}
        </IconButton>
        <IconButton variant="outlined" color="error" onClick={deleteBoard}>
          <DeleteOutlined />
        </IconButton>
      </Box>
      <Box sx={{ padding: "10px 50px" }}>
        <Box>
          <EmojiPicker icon={icon} onChange={onIconChange} />
          <TextField
            value={title}
            placeholder="Untitled"
            variant="outlined"
            fullWidth
            sx={{
              "& .MuiOutlinedInput-input": { padding: 0 },
              "& .MuiOutlinedInput-notchedOutline": { border: "unset " },
              "& .MuiOutlinedInput-root": {
                fontSize: "2rem",
                fontWeight: "700",
              },
            }}
            onChange={titleChange}
          />
          <TextField
            value={description}
            placeholder="Add a description"
            variant="outlined"
            multiline
            fullWidth
            sx={{
              "& .MuiOutlinedInput-input": { padding: 0 },
              "& .MuiOutlinedInput-notchedOutline": { border: "unset " },
              "& .MuiOutlinedInput-root": { fontSize: "0.8rem" },
            }}
            onChange={descriptionChange}
          />
        </Box>
        <Box>
          <Kanban sections={sections} boardId={boardId} />
        </Box>
      </Box>
    </>
  );
};

export default Board;
