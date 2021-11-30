import fs from "fs/promises";
import path from "path";

import { RequestHandler } from "express";

import rootPath from "../utils/path";

type contentDataType = {
  name: string;
  ["poster-image"]: string;
};

interface fileValuestypes {
  totalDataFetched: string;
  pagename: string;
  fileData: any;
}

const sortFiles = (filesArray: any, query: string) => {
  const fileValues: fileValuestypes[] = [];
  let totalCount: number = 0;
  filesArray.forEach((file: any, index: number) => {
    if (query) {
      const arrayCopy = [...file.page["content-items"].content];
      file.page["content-items"].content = arrayCopy.filter(
        (item: contentDataType) => {
          return item.name
            .toLocaleLowerCase()
            .startsWith(query.toLocaleLowerCase());
        }
      );
    }
    fileValues[index] = {
      totalDataFetched: file.page["content-items"].content.length.toString(),
      pagename: `page ${index + 1}`,
      fileData: file,
    };
    totalCount += file.page["content-items"].content.length;
  });
  return {
    fileValues,
    totalCount,
  };
};

const fetchFile = (path: string) => {
  return new Promise<any>(async (resolve, reject) => {
    try {
      const data = await fs.readFile(path, "utf8");
      resolve(JSON.parse(data));
    } catch (e) {
      reject(e);
    }
  });
};

const getFiles = (fileNo: number = 0) => {
  const promises = [];

  for (let index = 0; index < fileNo; index++) {
    const filePath = path.join(
      rootPath,
      "data",
      "API",
      `CONTENTLISTINGPAGE-PAGE${index + 1}.json`
    );
    promises.push(fetchFile(filePath));
  }

  return Promise.all(promises);
};

export const fetchContents: RequestHandler = (req, res, next) => {
  let pageNo: number = req.params.pageNo ? +req.params.pageNo : 0;
  let { q } = req.query;

  if (!q || typeof q !== "string") {
    q = "";
  }

  getFiles(3).then((result) => {
    const { fileValues, totalCount } = sortFiles(result, `${q}`);
    res
      .status(200)
      .json({ message: { pageNo, q, data: {totalCount,...fileValues[pageNo - 1]} } });
  });
};
