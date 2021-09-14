
// load status [0 - not loaded, 1 - loading, 2 - loaded and read]
// global item status list
let g_itemList = [
  { label: "Alarmclock", filename: "Alarmclock", loadOnStart: false, loadStatus: 0, selected: false },
  { label: "Amplifier", filename: "Amplifier", loadOnStart: false, loadStatus: 0, selected: false },
  { label: "Bean To Cup Coffee Maker", filename: "BeanToCupCoffeemaker", loadOnStart: false, loadStatus: 0, selected: false },
  { label: "Bread Cutter", filename: "Breadcutter", loadOnStart: false, loadStatus: 0, selected: false },
  { label: "Cd Player", filename: "CdPlayer", loadOnStart: false, loadStatus: 0, selected: false },
  { label: "Charger PSP", filename: "Charger_PSP", loadOnStart: false, loadStatus: 0, selected: false },
  { label: "Charger Smartphone", filename: "Charger_Smartphone", loadOnStart: false, loadStatus: 0, selected: false },
  { label: "Coffee Maker", filename: "Coffeemaker", loadOnStart: false, loadStatus: 0, selected: false },
  { label: "Cooking Stove", filename: "Cookingstove", loadOnStart: false, loadStatus: 0, selected: false },
  { label: "Digital Tv Receiver", filename: "DigitalTvReceiver", loadOnStart: false, loadStatus: 0, selected: false },
  { label: "Dishwasher", filename: "Dishwasher", loadOnStart: false, loadStatus: 0, selected: false },
  { label: "Dvd Player", filename: "DvdPlayer", loadOnStart: false, loadStatus: 0, selected: false },
  { label: "Ethernet Switch", filename: "EthernetSwitch", loadOnStart: false, loadStatus: 0, selected: false },
  { label: "Freezer", filename: "Freezer", loadOnStart: false, loadStatus: 0, selected: false },
  { label: "Steam Iron", filename: "Iron", loadOnStart: false, loadStatus: 0, selected: false },
  { label: "Lamp", filename: "Lamp", loadOnStart: false, loadStatus: 0, selected: false },
  { label: "Laundry Dryer", filename: "LaundryDryer", loadOnStart: false, loadStatus: 0, selected: false },
  { label: "Microwave Oven", filename: "MicrowaveOven", loadOnStart: false, loadStatus: 0, selected: false },
  { label: "Monitor CRT", filename: "Monitor_CRT", loadOnStart: false, loadStatus: 0, selected: false },
  { label: "Monitor TFT", filename: "Monitor_TFT", loadOnStart: false, loadStatus: 0, selected: false },
  { label: "Multi-media Center", filename: "Multimediacenter", loadOnStart: false, loadStatus: 0, selected: false },
  { label: "PC Desktop", filename: "PC_Desktop", loadOnStart: false, loadStatus: 0, selected: false },
  { label: "PC Laptop", filename: "PC_Laptop", loadOnStart: false, loadStatus: 0, selected: false },
  { label: "Playstation3", filename: "Playstation3", loadOnStart: false, loadStatus: 0, selected: false },
  { label: "Printer", filename: "Printer", loadOnStart: false, loadStatus: 0, selected: false },
  { label: "Projector", filename: "Projector", loadOnStart: false, loadStatus: 0, selected: false },
  { label: "Refrigerator", filename: "Refrigerator", loadOnStart: false, loadStatus: 0, selected: false },
  { label: "Remote Desktop", filename: "RemoteDesktop", loadOnStart: false, loadStatus: 0, selected: false },
  { label: "Router", filename: "Router", loadOnStart: false, loadStatus: 0, selected: false },
  { label: "Solar Thermal System", filename: "SolarThermalSystem", loadOnStart: false, loadStatus: 0, selected: false },
  { label: "Subwoofer", filename: "Subwoofer", loadOnStart: false, loadStatus: 0, selected: false },
  { label: "Toaster", filename: "Toaster", loadOnStart: false, loadStatus: 0, selected: false },
  { label: "TV CRT", filename: "TV_CRT", loadOnStart: false, loadStatus: 0, selected: false },
  { label: "TV LCD", filename: "TV_LCD", loadOnStart: false, loadStatus: 0, selected: false },
  { label: "USB Harddrive", filename: "USBHarddrive", loadOnStart: false, loadStatus: 0, selected: false },
  { label: "USB Hub", filename: "USBHub", loadOnStart: false, loadStatus: 0, selected: false },
  { label: "Vacuum Cleaner", filename: "VacuumCleaner", loadOnStart: false, loadStatus: 0, selected: false },
  { label: "Video Projector", filename: "VideoProjector", loadOnStart: false, loadStatus: 0, selected: false },
  { label: "Washing Machine", filename: "Washingmachine", loadOnStart: false, loadStatus: 0, selected: false },
  { label: "Water Boiler", filename: "WaterBoiler", loadOnStart: false, loadStatus: 0, selected: false },
  { label: "Water Kettle", filename: "WaterKettle", loadOnStart: false, loadStatus: 0, selected: false },
  { label: "Xmas Lights", filename: "XmasLights", loadOnStart: false, loadStatus: 0, selected: false }
];

function openNav() {
  document.getElementById("mySidebar").style.width = "250px";
  document.getElementById("main").style.marginLeft = "250px";
  document.getElementById("main").style.visibility = "hidden";
  document.getElementById("content").style.marginLeft = "250px";
}

function closeNav() {
  document.getElementById("mySidebar").style.width = "0";
  document.getElementById("main").style.marginLeft = "0";
  document.getElementById("content").style.marginLeft = "0";
  document.getElementById("main").style.visibility = "visible";
  // load all the items selected while the tab was open
  loadSelectedItems();
  
  if (getSelectedKeys().length !== 0) {
    document.getElementById("calendar").style.visibility = "visible";
    updateHelpSequence(0);
  }
}
