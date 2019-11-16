"using strict";

let itemList = [
  { label: "Alarmclock", dir: "Alarmclock" },
  { label: "Amplifier", dir: "Amplifier" },
  { label: "Bean To Cup Coffee Maker", dir: "BeanToCupCoffeemaker" },
  { label: "Bread Cutter", dir: "Breadcutter" },
  { label: "Cd Player", dir: "CdPlayer" },
  { label: "Charger PSP", dir: "Charger-PSP" },
  { label: "Charger Smartphone", dir: "Charger-Smartphone" },
  { label: "Coffee Maker", dir: "Coffeemaker" },
  { label: "Cooking Stove", dir: "Cookingstove" },
  { label: "Digital Tv Receiver", dir: "DigitalTvReceiver" },
  { label: "Dishwasher", dir: "Dishwasher" },
  { label: "Dvd Player", dir: "DvdPlayer" },
  { label: "Ethernet Switch", dir: "EthernetSwitch" },
  { label: "Freezer", dir: "Freezer" },
  { label: "Iron", dir: "Iron" },
  { label: "Lamp", dir: "Lamp" },
  { label: "Laundry Dryer", dir: "LaundryDryer" },
  { label: "Microwave Oven", dir: "MicrowaveOven" },
  { label: "Monitor CRT", dir: "Monitor-CRT" },
  { label: "Monitor TFT", dir: "Monitor-TFT" },
  { label: "Multi-media Center", dir: "Multimediacenter" },
  { label: "PC Desktop", dir: "PC-Desktop" },
  { label: "PC Laptop", dir: "PC-Laptop" },
  { label: "Playstation3", dir: "Playstation3" },
  { label: "Printer", dir: "Printer" },
  { label: "Projector", dir: "Projector" },
  { label: "Refrigerator", dir: "Refrigerator" },
  { label: "Remote Desktop", dir: "RemoteDesktop" },
  { label: "Router", dir: "Router" },
  { label: "Solar Thermal System", dir: "SolarThermalSystem" },
  { label: "Subwoofer", dir: "Subwoofer" },
  { label: "Toaster", dir: "Toaster" },
  { label: "TV CRT", dir: "TV-CRT" },
  { label: "TV LCD", dir: "TV-LCD" },
  { label: "USB Harddrive", dir: "USBHarddrive" },
  { label: "USB Hub", dir: "USBHub" },
  { label: "Vacuum Cleaner", dir: "VacuumCleaner" },
  { label: "Video Projector", dir: "VideoProjector" },
  { label: "Washing Machine", dir: "Washingmachine" },
  { label: "Water Boiler", dir: "WaterBoiler" },
  { label: "Water Fountain", dir: "WaterFountain" },
  { label: "Water Kettle", dir: "WaterKettle" },
  { label: "Xmas Lights", dir: "XmasLights" }
];

let days = [
    {name: "Sunday", value: "100"},
    {name: "Monday", value: "100"},
    {name: "Tuesday", value: "100"},
    {name: "Wednesday", value: "100"},
    {name: "Thursday", value: "100"},
    {name: "Friday", value: "100"},
    {name: "Saturday", value: "100"}
];
function pageInit() {
  var itemSelection = d3.select("#mySidebar").selectAll("label").data(itemList);
  itemSelection.enter()
    .append("label")
    .html(d => {
      return `<input type="checkbox" value="${d.dir}" onclick="onItemChecked(this)" /> ${d.label}`;
    })
    ;

  let calandar = d3.select("#calendar").selectAll("svg").selectAll("g").selectAll("rect").data(days).enter().append("g");

  let rec = calandar
      .append("rect")
      .attr("width", "13%")
      .attr("height", "25%")
      .attr("x", function (d, i) {
        return (13 * i) + "%";
      })
      .style("fill", "#8D230F")
      .on("mouseover", function () {
        d3.select(this).style("fill", "#af6557");
        d3.select(this).style("cursor", "pointer");
      })
      .on("mouseout", function () {
        d3.select(this).style("fill", "#8D230F");
        d3.select(this).style("cursor", "default");
      })
  ;
  calandar.append("text").text(function (d) {
          return d.name;
      })
      .attr("x", function (d, i) {
        return (13 * i) + "%";
      })
      .attr("y","24px")
  ;


}

function openNav() {
  document.getElementById("mySidebar").style.width = "250px";
  document.getElementById("main").style.marginLeft = "250px";
  document.getElementById("main").style.visibility = "hidden";
  document.getElementById("content").style.marginLeft = "250px";
}

function closeNav() {
  document.getElementById("mySidebar").style.width = "0";
  document.getElementById("main").style.marginLeft= "0";
  document.getElementById("content").style.marginLeft = "0";
  document.getElementById("main").style.visibility = "visible";
}