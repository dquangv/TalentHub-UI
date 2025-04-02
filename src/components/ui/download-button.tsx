import { Button } from "antd";
import axios from "axios";

const DownloadButton = ({publicId}: any) => {
  const handleDownload = () => {
    console.log('public id ', publicId)
    axios
      .get(
        `http://localhost:8080/api/pdf/download?publicId=${publicId}`,
        { responseType: "blob" }
      )
      .then((res) => {
        console.log(res);
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "file.pdf"); 
        document.body.appendChild(link);
        link.click();
      })
      .catch((error) => console.error("Download error:", error));
  };

  return <Button onClick={handleDownload}>Download PDF</Button>;
};
export default DownloadButton;