import { readFile, writeFile } from "./utils/fileHandler.js";
import {
  countMatch,
  findItemById,
  isIdNotExist,
  printDataTabular,
} from "./utils/helper.js";
import {
  getNonEmptyString,
  getPostAuthor,
  getPostContent,
  getPostDate,
  getPostId,
  getPostTitle,
  getPostTopic,
  getSortType,
} from "./utils/inputHandler.js";
import { keyInSelect, keyInYNStrict } from "readline-sync";

const handleInputNewPost = (postData, mode = "new", currentData = {}) => {
  let newPostData = {
    id: -1,
    title: "",
    content: "",
    topic: "",
    author: "",
    date: "",
  };

  if (mode === "new") {
    while (true) {
      newPostData.id = Number(getPostId());
      if (isIdNotExist(postData, newPostData.id)) {
        break;
      }
      console.log("Id đã tồn tại ! Vui lòng nhập lại");
    }

    newPostData.title = getPostTitle();
    newPostData.content = getPostContent();
    newPostData.topic = getPostTopic();
    newPostData.author = getPostAuthor();
    newPostData.date = getPostDate();
  }

  if (mode === "edit") {
    newPostData.id = currentData.id;
    newPostData.title = getPostTitle(currentData.title);
    newPostData.content = getPostContent(currentData.content);
    newPostData.topic = getPostTopic(currentData.topic);
    newPostData.author = getPostAuthor(currentData.author);
    newPostData.date = getPostDate(currentData.date);
  }

  return newPostData;
};

const handleEditPost = (postData) => {
  let id = null;
  let index = -1;
  while (true) {
    id = Number(getPostId());
    index = findItemById(postData, id);
    if (index !== -1) {
      break;
    }
    console.log("Id không tìm thấy. Vui lòng nhập lai !");
  }

  console.log("Đây là bài viết hiện tại: ");
  console.table(postData[index]);
  let newPostData = handleInputNewPost(postData, "edit", postData[index]);

  // preview new data
  console.log("Đây la bài viết sau khi sửa: ");
  printDataTabular([newPostData]);

  // update data
  postData[index] = newPostData;
  return postData;
};

const handleDeletePost = (postData) => {
  let id = null;
  let index = -1;
  while (true) {
    id = Number(getPostId("Nhập id bài viết bạn muốn xóa: "));
    index = findItemById(postData, id);
    if (index !== -1) {
      break;
    }
    console.log("Id không tìm thấy. Vui lòng nhap lai !");
  }

  // show the found item
  console.log("Đây là bài viết được tìm thấy: ");
  console.table(postData[index]);

  // confirm to delete
  let answer = keyInYNStrict("Xóa bài viết ? ");
  if (answer) {
    postData.splice(index, 1);
  }

  return postData;
};

const handleSearchByKeywords = (postData, sortType) => {
  let keywords = getNonEmptyString("Nhập từ khóa tìm kiếm: ").split(" ");

  postData.sort((a, b) => {
    let firstTextContent = `${a.title},${a.content},${a.topic},${a.author}`
      .trim()
      .toLowerCase();
    let secondTextContent = `${b.title},${b.content},${b.topic},${b.author}`
      .trim()
      .toLowerCase();

    switch (sortType) {
      case 0:
        return (
          countMatch(firstTextContent, keywords) -
          countMatch(secondTextContent, keywords)
        );
      case 1:
        return (
          countMatch(secondTextContent, keywords) -
          countMatch(firstTextContent, keywords)
        );
      default:
        throw new Error("Invalid sort type");
    }
  });

  return postData;
};

const sortByDate = (postData, sortDateType) => {
  switch (sortDateType) {
    case 0:
      postData.sort((a, b) => new Date(a.date) - new Date(b.date));
      break;
    case 1:
      postData.sort((a, b) => new Date(b.date) - new Date(a.date));
      break;
    default:
      throw new Error("Invalid sort date type");
  }

  return postData;
};

const handleFilterByTopic = (postData) => {
  let topic = getPostTopic();

  let filteredPostData = postData.filter((post) => {
    return post.topic.toLowerCase().includes(topic.toLowerCase());
  });

  return filteredPostData;
};

const printMenu = (menuData) => {
  return keyInSelect(menuData, "Lựa 1 item", {
    encoding: "utf8",
  });
};

const handleMenuAction = (chosenItem) => {
  let fileData = null,
    newPostData = null;
  console.clear();
  switch (chosenItem) {
    case 0:
      fileData = readFile("posts.json", "data");
      printDataTabular(fileData.posts);
      break;
    case 1:
      fileData = readFile("posts.json", "data");
      newPostData = handleInputNewPost(fileData.posts);
      fileData.posts.push(newPostData);
      writeFile("posts.json", fileData, "data");
      break;
    case 2:
      fileData = readFile("posts.json", "data");

      newPostData = handleEditPost(fileData.posts);
      fileData.posts = JSON.parse(JSON.stringify(newPostData));

      writeFile("posts.json", fileData, "data");
      break;
    case 3:
      fileData = readFile("posts.json", "data");
      // print out current data before delete
      printDataTabular(fileData.posts);

      // handle delete data
      newPostData = handleDeletePost(fileData.posts);

      // update old data with new data
      fileData.posts = JSON.parse(JSON.stringify(newPostData));

      // write to file
      writeFile("posts.json", fileData, "data");
      break;
    case 4:
      fileData = readFile("posts.json", "data");

      // print out current data before filter
      printDataTabular(fileData.posts);

      // get topic
      let filteredData = handleFilterByTopic(fileData.posts);
      printDataTabular(filteredData);
      break;
    case 5:
      fileData = readFile("posts.json", "data");

      // print out current data before sort
      printDataTabular(fileData.posts);

      // get sort date type
      let sortDateType = getSortType(
        ["tăng dần", "giảm dần"],
        "Sắp xếp theo ngày"
      );

      newPostData = sortByDate(fileData.posts, sortDateType);

      // show new sorted data by date in table
      printDataTabular(newPostData);
      break;
    case 6:
      fileData = readFile("posts.json", "data");

      // print out current data before sort
      printDataTabular(fileData.posts);

      // get sort date type
      let sortType = getSortType(
        ["tăng dần", "giảm dần"],
        "Sắp xếp theo mức độ liên quan tới từ khóa: "
      );

      newPostData = handleSearchByKeywords(fileData.posts, sortType);

      // show new sorted data by keyword relevancy in table
      printDataTabular(newPostData);
      break;
    default:
      break;
  }
};

let fileData = readFile("menu.json", "data");
let chosenItem = null;
while (true) {
  console.clear();
  chosenItem = printMenu(fileData.menu);

  handleMenuAction(chosenItem);
  if (chosenItem === -1) {
    console.log("EXIT");
    break;
  }
  let answer = keyInYNStrict("Bạn có muốn tiếp tục không ? ");
  if (!answer) {
    break;
  }
}
