//
var csvLines;
//
//--------------------------------------------------------------------------------//

//------------------------------- Global Constants -------------------------------//
//
const FILE_NAME = "GeneratedCSV.csv";
const ENCODING = "ISO-8859-1";
//
//--------------------------------------------------------------------------------//

//------------------------------------- Main -------------------------------------//
//

// this part contains the event Listener used to display the choosen file's name
const actualBtn = document.getElementById("txtFile");
const fileChosen = document.getElementById("chosenFile");
actualBtn.addEventListener("change", function () {
  fileChosen.textContent = this.files[0].name;
});

/**
 * Description : Generates the csv File
 *
 * Input :
 * - None
 *
 * Output :
 * - None
 *
 * Authors :
 * - Sébastien HERT
 */
function generateCSV() {
  // Getting the File
  var txtFile = document.getElementById("txtFile");

  console.log(txtFile);

  // Init the lines
  csvLines = [];

  // Reading the file
  this.readFile(txtFile);
}

/**
 * Description : Reads the input file
 *
 * Input :
 * - file : the html element which contains the given file
 *
 * Output :
 * - None
 *
 * Authors :
 * - Sébastien HERT
 */
function readFile(file) {
  var reader = new FileReader();

  reader.onload = function (e) {
    const txtContent = e.target.result;
    const lines = txtContent.split("\n");
    let csvContent = "DeviceID,SecretKey,batchCode\n";

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line) {
        // 这里假设TXT文件每行内容是三个值，以空格分隔
        const values = line.split(" ");
        csvContent += values.join(",") + "\n";
      }
    }

    var element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/csv;charset=utf-8," + encodeURIComponent(csvContent)
    );
    element.setAttribute("download", FILE_NAME);

    element.style.display = "none";
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  };
  reader.readAsText(file.files[0], ENCODING);
}

//================================================================================//

function generateXLS() {
  // Getting the File
  var txtFile = document.getElementById("txtFile");

  console.log(txtFile);

  // Init the lines
  csvLines = [];

  // Reading the file
  this.converter(txtFile?.files[0]);
}

const sideTit = ["设备类型", "品牌", "客户端", "主域", "子域"];

function converter(file) {
  const reader = new FileReader();
  reader.onload = function (e) {
    const txtContent = e.target.result;
    let sideData = [];
    if (txtContent.startsWith("0113")) {
      sideData.push("3013", "1", "hmct", "208", "301");
    } else if (txtContent.startsWith("0012")) {
      sideData.push("3012", "0", "Unbound", "208", "299");
    } else if (txtContent.startsWith("0016")) {
      sideData.push("3014", "0", "juhaokan", "208", "304");
    } else if (txtContent.startsWith("000d")) {
      sideData.push("3011", "0", "Unbound", "208", "296");
    } else if (txtContent.startsWith("0108")) {
      sideData.push("3006", "1", "hmct", "208", "295");
    } else if (txtContent.startsWith("0107")) {
      sideData.push("3007", "1", "hmct", "208", "285");
    } else if (txtContent.startsWith("020a")) {
      sideData.push("3009", "2", "hmct", "208", "275");
    } else if (txtContent.startsWith("0206")) {
      sideData.push("3008", "2", "hmct", "208", "275");
    }
    // 将文本内容按行分割
    const lines = txtContent.split("\n");
    const data = [["设备码"]];
    for (let i = 0; i < lines.length; i++) {
      // 假设每行内容为一个单元格的数据
      if (i >= 2 && i < 7) {
        newline = [
          lines[i],
          "",
          "",
          "",
          sideTit[i - 2] ?? "",
          sideData[i - 2] ?? "",
        ];
        data.push(newline);
        continue;
      }
      data.push([lines[i]]);
    }
    const worksheet = XLSX.utils.aoa_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    // 修改 XLSX.write 的参数
    const xlsxBinary = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "binary",
    });
    // 使用 XLSX.writeFile 保存文件
    XLSX.writeFile(workbook, "converted.xlsx", { bookType: "xlsx" });
  };
  reader.readAsText(file);
}
