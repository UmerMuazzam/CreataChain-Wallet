import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Tokens from "./Tokens";
import History from "./History";
import ImportNFT from "./ImportNFT";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function BasicTabs({ myValue, transactionHistory }) {
  const [value, setValue] = React.useState(0);
  const tokenTransactionHistory =
    JSON.parse(localStorage.getItem("tokenTxHistory")) || [];

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%", mt:'1rem'}}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="Activity" {...a11yProps(0)} />
          <Tab label="Token" {...a11yProps(1)} />
          <Tab label="NFT" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <History
          value={"Transaction hash"}
          transactionHistory={tokenTransactionHistory}
        />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <Tokens />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        
        <ImportNFT/>

      </CustomTabPanel>
    </Box>
  );
}
