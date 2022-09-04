import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { CgImage } from "react-icons/cg";
import { MdContentCopy, MdOutlineCheck } from "react-icons/md";
import { FiUploadCloud } from "react-icons/fi";
import { CopyToClipboard } from "react-copy-to-clipboard";
import axios from "axios";

const ColorCard = ({ color, key }) => {
  const [copied, setCopied] = useState(false);

  return (
    <div
      key={key}
      className="w-full grid items-end h-48"
      style={{ background: color }}
    >
      <CopyToClipboard text={color} onCopy={() => setCopied(true)}>
        <div className="flex items-center justify-between bg-white/70 p-2">
          <p className="text-center font-semibold text-gray-800">{color}</p>
          {copied ? <MdOutlineCheck /> : <MdContentCopy />}
        </div>
      </CopyToClipboard>
    </div>
  );
};

function FileDropzone() {
  const [files, setFiles] = useState([]);
  const [palette, setPalette] = useState([]);
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [],
    },
    onDrop: (acceptedFiles) => {
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );

      setPalette([]);

      if (acceptedFiles.length > 0) {
        const data = new FormData();
        data.append("image", acceptedFiles[0]);
        axios
          .post(
            `https://color-generator.azurewebsites.net/api/colorgenerator`,
            data
          )
          .then((res) => {
            setPalette(res.data["colors"]);
          });
      }
    },
  });

  const thumbs = files.map((file) => (
    <div className="grid justify-items-center h-full">
      <div className="grid justify-items-center items-center w-full max-w-6xl p-10">
        <div className="grid justify-items-center gap-5 w-full">
          <img src={file.preview} alt="preview" className="h-96" />
          {palette.length === 5 ? (
            <div className="grid grid-cols-3 md:grid-cols-5 w-full">
              {palette.map((color, key) => {
                return <ColorCard key={key} color={color} />;
              })}
            </div>
          ) : (
            <div className="h-48 w-full grid place-items-center">
              <svg
                aria-hidden="true"
                className="mr-2 w-16 h-16 text-gray-200 animate-spin fill-blue-1000"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  ));

  useEffect(() => {
    return () => files.forEach((file) => URL.revokeObjectURL(file.preview));
  }, [files]);

  return (
    <section
      className="min-h-screen grid justify-items-center w-full items-center border-none"
      style={{ gridTemplateRows: "auto 1fr" }}
    >
      <div className="grid justify-items-center bg-blue-1000 w-full">
        <div className="px-10 py-5 flex justify-between items-center w-full max-w-screen-2xl">
          <span className="text-2xl text-white font-bold">
            Palette <span className="font-light">Generator</span>
          </span>
          {files.length > 0 && (
            <div {...getRootProps({ className: "px-1.5" })}>
              <input {...getInputProps()} />
              <button className="flex text-sm items-center gap-2.5 text-md opacity-70 hover:opacity-100 text-white">
                <CgImage className="text-xl" /> Change image
              </button>
            </div>
          )}
        </div>
      </div>

      {files.length > 0 ? (
        <div className="w-full grow">{thumbs}</div>
      ) : (
        <div
          {...getRootProps({
            className:
              "grow grid justify-items-center rounded-lg bg-cyan-500/3 border-4 border-dashed border-blue-900 w-fit p-10 m-5",
          })}
        >
          <input {...getInputProps()} />
          <div className="grid justify-items-center gap-5 px-10 py-5 max-w-sm">
            <p className="text-2xl text-center">
              Generate a color palette from an image
            </p>
            <FiUploadCloud className="text-6xl text-blue-600" />
            <p className="font-bold text-2xl text-center">
              Drag and drop an image <br /> or{" "}
              <span className="text-blue-600">choose a file</span>
            </p>
          </div>
        </div>
      )}
    </section>
  );
}

export default FileDropzone;
