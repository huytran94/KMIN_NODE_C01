/**
 * {
        "id": 1,
        "title": "Hướng Dẫn Lập Trình JavaScript Cơ Bản",
        "content": "Nội dung của bài viết về JavaScript cơ bản...",
        "topic": "Lập Trình",
        "author": "Vũ Đình Bảo",
        "date": "2023-01-15"
    },
 */

import { keyInSelect, question } from "readline-sync";
import { isNumber } from "./helper.js";

const getNonEmptyString = (
  title = "Nhập: ",
  errorMessage = "Không được để trống",
  defaultValue = ""
) => {
  let inputStr = question(title, {
    limit: (value) => {
      return value.length > 0;
    },
    limitMessage: errorMessage,
    defaultInput: defaultValue,
  });

  return inputStr;
};

/**
 * Gets an id of a blog post from user input.
 * @returns {number} The id of the blog post.
 */
const getPostId = (defaultInput = "") => {
  let id = question("Nhập id bài viết:", {
    limit: (value) => {
      if (isNumber(value) && parseInt(value) >= 0) {
        return true;
      }
      return false;
    },
    limitMessage: "Vui lòng nhập vào số nguyên dương",
    defaultInput: defaultInput,
  });

  return id;
};

/**
 * Gets title of a blog post from user input.
 * @returns {string} The title of the blog post.
 */
const getPostTitle = (defaultInput = "") => {
  let title = getNonEmptyString(
    "Nhập tiêu đề bài viết: ",
    "Tiêu đề không được để trống",
    defaultInput
  );
  return title;
};

/**
 * Gets content of a blog post from user input.
 * @returns {string} The content of the blog post.
 */
const getPostContent = (defaultInput = "") => {
  let content = getNonEmptyString(
    "Nhập nội dung bài viết: ",
    "Nội dung bài viết không được để trống",
    defaultInput
  );

  return content;
};

/**
 * Gets a topic for a blog post from user input.
 * @returns {string} The topic of the blog post.
 */
const getPostTopic = (defaultInput = "") => {
  let topic = getNonEmptyString(
    "Nhập chủ đề bài viết: ",
    "Vui lòng nhập chủ đề bài viết",
    defaultInput
  );

  return topic;
};

/**
 * Input author
 * @returns {string} author
 */
const getPostAuthor = (defaultInput = "") => {
  let author = getNonEmptyString(
    "Nhập tên tác giả: ",
    "Vui lòng nhập tên tác giả",
    defaultInput
  );
  return author;
};

/**
 * Gets year of a blog post from user input.
 * @returns {number} The year of the blog post.
 */
const getYear = (defaultInput = 1000) => {
  let year = question("Nhập năm:", {
    limit: (value) => {
      if (!isNumber(value) || parseInt(value) < 1) {
        return false;
      }
      return parseInt(value);
    },
    limitMessage: "Năm không hợp lệ, vui lòng nhập lại",
    defaultInput: defaultInput,
  });

  return year;
};

/**
 * Gets month of a blog post from user input.
 * @returns {number} The month of the blog post.
 */
const getMonth = (defaultInput = 1) => {
  let month = question("Nhập tháng:", {
    limit: (value) => {
      if (isNumber(value) && parseInt(value) <= 12 && parseInt(value) > 0) {
        return true;
      }
      return false;
    },
    limitMessage: "Tháng không hợp lệ, vui lòng nhập lại",
    defaultInput: defaultInput,
  });
  return month;
};

/**
 * Gets day of a blog post from user input.
 * @returns {number} The day of the blog post.
 */
const getDay = (defaultInput = 1) => {
  let day = question("Nhập ngày:", {
    limit: (value) => {
      if (isNumber(value) && parseInt(value) <= 31 && parseInt(value) > 0) {
        return true;
      }
      return false;
    },
    limitMessage: "Ngày không hợp lệ, vui lòng nhập lại",
    defaultInput: defaultInput,
    print: () => {}
  });
  return day;
};

/**
 * Gets date of a blog post from user input.
 * @returns {string} The date of the blog post.
 */
const getPostDate = (defaultInput = "") => {
  let dateData = defaultInput.split("-");
  let day = Number(getDay(dateData[2]));
  let month = Number(getMonth(dateData[1]));
  let year = Number(getYear(dateData[0]));

  if ((month === 4 || month === 6 || month === 9 || month === 11) && day > 30) {
    console.log("Ngày không hợp lệ, vui lòng nhập lại");
    day = Number(getDay());
  }

  if (month === 2 && day > 28) {
    console.log("Ngày không hợp lệ, vui lòng nhap lai");
    day = Number(getDay());
  }

  if (
    month === 2 &&
    day === 29 &&
    (year % 4 !== 0 || (year % 100 === 0 && year % 400 !== 0))
  ) {
    console.log("Ngày không hợp lệ, vui lòng nhap lai");
    day = Number(getDay());
  }

  month = month < 10 ? `0${month}` : month;
  day = day < 10 ? `0${day}` : day;

  let date = `${year}-${month}-${day}`;
  return date;
};

/**
 * Gets a type of sorting date from user input.
 * @returns {number} Type of sorting date (0: increasing, 1: decreasing).
 */
let getSortType = (choices = [], message) => {
  return keyInSelect(choices, message);
};

export {
  getPostId,
  getPostTitle,
  getPostContent,
  getPostTopic,
  getPostAuthor,
  getPostDate,
  getNonEmptyString,
  getSortType,
};
