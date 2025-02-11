"use client";
import { useState, useEffect } from "react";
import mqtt, { MqttClient } from "mqtt";
import { toast } from "react-toastify";
import CarJoyStick from "./carJoyStick";
import CarPanel from "./carPanel";
import React from "react";
import PressButton from "@/components/button/pressButton";
import ToggelButton from "@/components/button/toggleButton";
import ToggleRecieve from "@/components/button/toggleRecieve";
import { CirclePlus, Wrench } from "lucide-react";

type Props = {
  device_id: string;
};

type ButtonProps = {
  id: number;
  buttonType: string;
  buttonCategory: string;
  buttonLabel: string;
  buttonCommand: string;
};

interface DeviceData {
  deviceId: string;
  deviceName: string;
  devicePath: string;
  deviceType: string;
  deviceOwner: string;
  productPassword: string;
  productId: number;
  status: string;
  wifiId: string;
  wifiConnect: string;
  description: string;
  actionId: number;
}

interface WifiData {
  _id: string;
  wifiId: string;
  wifiName: string;
  wifiPassword: string;
  status: string;
}
const fetchDeviceId = async (deviceId: string) => {
  const response = await fetch(`/api/devices/${deviceId}`);
  return response.json();
};

const fetchWifiId = async (wifiId: string) => {
  const ressponse = await fetch(`/api/wifi/${wifiId}`);
  return ressponse.json();
};

export default function FormPage({ device_id }: Props) {
  const deviceId = device_id;
  const [client, setClient] = useState<MqttClient | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [topic, setTopic] = useState<string>("");
  const [isLoading, setLoading] = useState<boolean>(false);
  const [returnedLog, setReturnedLog] = useState<string>("");
  const [hover, setHover] = useState(false);
  const [popUp_click, setPopUpClick] = useState<boolean>();
  const [wifiName, setWifiName] = useState<string>();
  const [wifiPW, setWifiPW] = useState<string>();
  const [wifiData, setWifiData] = useState<WifiData>();
  const [popUp_clearWifi, setPopUpclearWifi] = useState<boolean>();
  const [deviceData, setDeviceData] = useState<DeviceData>();
  const [deviceConnected, setDeviceConnected] = useState<boolean>(false);
  const [buttons, setButtons] = useState<ButtonProps[]>([]);
  useEffect(() => {
    fetchDeviceId(deviceId).then((item: any) => {
      setDeviceData(item);
      setLoading(true);
      setTopic(item.topic);
    });
    setLoading(true);
    const client = mqtt.connect(
      "wss://4cff082ff4a746da91e5ff64e35e8674.s1.eu.hivemq.cloud:8884/mqtt",
      {
        username: "admin",
        password: "Bam1234!",
        protocol: "wss",
      }
    );
    client.on("connect", () => {
      setIsConnected(true);
      console.log("Connected to HiveMQ broker over WebSocket");
    });
    client.on("error", (err) => {
      console.error("Connection error: ", err.message);
      console.error("Details: ", err);
      client.end();
    });

    setClient(client);
    return () => {
      if (client) {
        client.end();
      }
    };
  }, []);

  useEffect(() => {
    console.log("Listen Event Start...");
    const client = mqtt.connect(
      "wss://4cff082ff4a746da91e5ff64e35e8674.s1.eu.hivemq.cloud:8884/mqtt",
      {
        username: "admin",
        password: "Bam1234!",
        protocol: "wss",
      }
    );
    console.log("is connecting...");
    client.on("connect", () => {
      if (topic != null) {
        client.subscribe(topic, (err) => {
          if (!err) {
            console.log("Subscribed to Connected Message");
          }
        });
      } else {
        console.log("none topic");
      }
    });
    client.on("message", (topic, message) => {
      console.log(`Received message on ${topic}: ${message}`);
      if (message.toString() == "connected") {
        setDeviceConnected(true);
        console.log("Device is connected. Cleaning up...");
        client.unsubscribe(topic);
        client.end();
      }
    });
    return () => {
      console.log("Cleaning up MQTT connection...");
      client.unsubscribe(topic);
      client.end();
    };
  }, [topic]);

  const getLogReturned = (data: string) => {
    setReturnedLog(data);
  };

  const onClickPopUp = async () => {
    setPopUpClick(true);
    if (deviceData?.wifiId) {
      await fetchWifiId(deviceData?.wifiId).then((item) => {
        setWifiData(item);
      });
    }
  };
  const onClosePopUp = () => {
    setPopUpClick(false);
  };

  const handleClearDefaultWifi = async () => {
    if (client && isConnected) {
      client.publish(topic, `defaultwifi`);
      try {
        const newWifiName = "Default";
        const newWifiPassword = "12345678";
        const newStatus = "none";
        const response = await fetch(
          `http://localhost:3000/api/wifi/${wifiData?._id}`,
          {
            method: "PUT",
            headers: {
              "Content-type": "application/json",
            },
            body: JSON.stringify({
              newWifiName,
              newWifiPassword,
              newStatus,
            }),
          }
        );
        if (response.ok) {
          toast.success("wi-fi Cleared !!");
          setWifiName("Default");
          setWifiPW("12345678");
          onClosePopUp();
          setPopUpclearWifi((popUp_clearWifi) => !popUp_clearWifi);
        } else {
          toast.error("something went wrong.");
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      toast.error("Lost Connect...");
    }
  };
  const handleWifiEdit = async () => {
    if (client && isConnected) {
      if (wifiName && wifiPW) {
        const wfn = wifiName;
        const wfp = wifiPW;
        console.log(`wfn:${wfn},wfp:${wfp}`);
        client.publish(topic, `wfn:${wfn},wfp:${wfp}`);
        try {
          const newWifiName = wifiName;
          const newWifiPassword = wifiPW;
          const newStatus = "Change";
          const response = await fetch(
            `http://localhost:3000/api/wifi/${wifiData?._id}`,
            {
              method: "PUT",
              headers: {
                "Content-type": "application/json",
              },
              body: JSON.stringify({
                newWifiName,
                newWifiPassword,
                newStatus,
              }),
            }
          );
          if (response.ok) {
            toast.success("wi-fi changed.");
            onClosePopUp();
          } else {
            toast.error("something went wrong.");
          }
        } catch (err) {
          console.error(err);
        }
      } else {
        toast.error("Please Change wi-fi name & password.");
      }
    } else {
      toast.error("wait to connecting...");
    }
  };

  const [adjust, setAdjust] = useState<boolean>(false);
  const [popup_btn, setPopUpBtn] = useState<boolean>(false);
  const handleChangeAdjust = () => {
    setAdjust(!adjust);
  };
  return (
    <div className={`bg-gray-700 pb-10 px-5`}>
      <div className="w-full py-2 ">
        <div className="my-3 lg:flex lg:justify-between gap-3 grid place-items-center">
          <div className="lg:mx-10 lg:block hidden"></div>
          <h1
            className={`duration-1000 py-3 ${
              isLoading
                ? "px-14 text-3xl text-white  bg-gray-800 rounded-2xl"
                : "px-0 text-gray-700 "
            } line-clamp-1 h-fit`}
          >
            Car Controller
          </h1>
          <button
            className={`flex justify-center gap-4  mx-3 w-fit h-fit  py-2 text-xl rounded-2xl  shadow-sm shadow-gray-800 active:shadow-inner active:shadow-black   hover:bg-blue-400 hover:text-black ${
              isLoading
                ? "px-5 text-white bg-blue-600"
                : "px-0 bg-blue-300 text-blue-300"
            } `}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            onClick={onClickPopUp}
          >
            <img
              src={
                hover
                  ? "/general/wifiBlack_icon.png"
                  : "/general/wifiWhite_icon.png"
              }
              alt="icon"
              className={`w-7 h-7 ${
                isLoading ? "animate-fadeIn" : "opacity-0"
              } `}
            />
            Wi-fi setting
          </button>
        </div>
      </div>
      <div className=" grid gap-10 place-items-center px-10 lg:flex lg:justify-center md:flex md:justify-center items-start   border-2 border-dashed border-gray-400 shadow-md shadow-gray-800 py-10 rounded-md lg:h-fit">
        <div className="lg:flex md:flex justify-center hidden    w-full lg:w-fit lg:py-5  ">
          {topic && (
            <CarPanel
              isConnected={isConnected}
              client={client}
              topic={topic}
              isLoading={isLoading}
              device_id={deviceId}
              device_log={returnedLog}
              device_connect={deviceConnected}
            />
          )}
        </div>
        <div className="grid gap-4   lg:h-fit px-10 lg:py-5 w-fit">
          <div className="flex justify-start gap-3">
            <button
              className={`${
                adjust
                  ? "shadow-md  bg-blue-700  shadow-black   text-white"
                  : "bg-white font-semibold text-blue-800 "
              } h-fit text-xl   w-[150px] shadow-md hover:bg-gray-500 shadow-gray-700  px-5 py-1 rounded-2xl`}
              onClick={handleChangeAdjust}
            >
              {adjust ? (
                <div className="">Default</div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <Wrench
                    style={{ width: "1.4rem", height: "1.4rem" }}
                    className="mt-1"
                  />
                  Custom
                </div>
              )}
            </button>
            <button
              className={` ${
                adjust ? "block animate-fastFade" : "hidden"
              } bg-white text-blue-700 font-semibold px-5 w-[150px] h-fit line-clamp-1 overflow-hidden text-lg shadow-md shadow-gray-700  hover:bg-gray-500 hover:text-white py-1 justify-end rounded-2xl`}
              onClick={() => setPopUpBtn(!popup_btn)}
            >
              <CirclePlus
                style={{ width: "1.4rem", height: "1.4rem" }}
                className="absolute -translate-x-2 translate-y-[3px]"
              />
              <div className="translate-x-3">Add Button</div>
            </button>
          </div>
          {!adjust ? (
            <CarJoyStick
              isConnected={isConnected}
              client={client}
              topic={topic}
              isLoading={isLoading}
              onLogReturn={getLogReturned}
            />
          ) : (
            <div className="animate-fastFade">
              {buttons.length > 0 ? (
                <div className="border-2 border-dashed grid grid-cols-2 px-10 py-5 rounded-lg gap-2  w-full ">
                  {buttons.map((item) => (
                    <div>
                      {item.buttonType == "transmitter" ? (
                        <div className="animate-fastFade grid place-items-center w-full">
                          {item.buttonCategory == "press" ? (
                            <PressButton
                              category={item.buttonCategory}
                              cmd={item.buttonCommand}
                              label={item.buttonLabel}
                              type={item.buttonType}
                              isConnected={isConnected}
                              client={client}
                              topic={topic}
                              onLogReturn={getLogReturned}
                            />
                          ) : (
                            <ToggelButton
                              category={item.buttonCategory}
                              cmd={item.buttonCommand}
                              label={item.buttonLabel}
                              type={item.buttonType}
                              isConnected={isConnected}
                              client={client}
                              topic={topic}
                              onLogReturn={getLogReturned}
                            />
                          )}
                        </div>
                      ) : (
                        <div className="grid place-items-center w-full">
                          <ToggleRecieve
                            category={item.buttonCategory}
                            cmd={item.buttonCommand}
                            label={item.buttonLabel}
                            type={item.buttonType}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="border-2 border-dashed grid grid-cols-2 px-10 py-5 rounded-lg  w-full h-[250px]"></div>
              )}
            </div>
          )}
        </div>
      </div>
      {popUp_click == true && (
        <div
          className="fixed inset-0 flex items-center duration-1000 animate-appearance-in justify-center bg-gray-200 bg-opacity-45"
          onClick={onClosePopUp}
        >
          <div
            className="bg-gray-800 shadow-lg shadow-gray-950  px-12 py-10 rounded-lg w-3/10 z-100 grid place-items-center duration-500"
            onClick={(e) => e.stopPropagation()}
          >
            <h1 className="text-white text-3xl text-center shadow-md shadow-black bg-gray-900 rounded-md px-10 py-2 w-3/5">
              Wi-fi Setup
            </h1>
            <div className="px-5 pt-10 grid space-y-10 w-4/5">
              <div className="grid grid-cols-2">
                <label className="text-white text-xl ">Wi-fi Name : </label>
                <input
                  type="text"
                  className="pl-2 py-1 rounded-lg shadow-inner shadow-black bg-gray-500 text-white text-xl"
                  name="wf_name"
                  defaultValue={wifiData?.wifiName}
                  onChange={(e) => {
                    setWifiName(e.target.value);
                  }}
                  value={wifiName}
                />
              </div>
              <div className="grid grid-cols-2">
                <label className="text-white text-xl">Password : </label>
                <input
                  name="wf_pw"
                  type="text"
                  className="pl-2 py-1 shadow-inner shadow-black rounded-lg bg-gray-500 text-white text-xl"
                  defaultValue={wifiData?.wifiPassword}
                  onChange={(e) => {
                    setWifiPW(e.target.value);
                  }}
                  value={wifiPW}
                />
              </div>
              <div className="flex justify-center w-full gap-5">
                <button
                  onClick={handleWifiEdit}
                  className="text-white bg-blue-600 px-14 py-2 rounded-md hover:bg-gray-200 hover:text-black shadow-md  text-xl shadow-gray-900 duration-1000"
                >
                  Change
                </button>
                <button
                  onClick={onClosePopUp}
                  className="bg-gray-600 shadow-md px-14 hover:bg-gray-800 py-2 rounded-md shadow-gray-900 text-white font-bold text-xl duration-1000 "
                >
                  Cancel
                </button>
              </div>
              {wifiData?.status == "Change" && (
                <div className="flex justify-center">
                  <button
                    className="bg-gray-200 text-black text-lg px-5 py-2 rounded-md hover:bg-red-500 hover:text-white duration-500"
                    onClick={() =>
                      setPopUpclearWifi((popUp_clearWifi) => !popUp_clearWifi)
                    }
                  >
                    Clear to default Wi-fi
                  </button>
                </div>
              )}
            </div>
            {popUp_clearWifi == true && (
              <div
                className="fixed inset-0 flex items-center justify-center bg-gray-200 bg-opacity-35"
                onClick={() =>
                  setPopUpclearWifi((popUp_clearWifi) => !popUp_clearWifi)
                }
              >
                <div
                  className="bg-gray-800 px-12 py-5 rounded-lg w-1/5 z-110 duration-500  shadow-lg shadow-gray-950 "
                  onClick={(e) => e.stopPropagation()}
                >
                  <h1 className="text-center text-white text-2xl py-4">
                    Confirm set to default Wi-Fi
                  </h1>
                  <div className="flex justify-center w-full my-3 gap-5">
                    <button
                      onClick={handleClearDefaultWifi}
                      className="text-white  bg-blue-600 px-6 py-2 rounded-md hover:bg-gray-200 shadow-md  text-xl hover:text-black shadow-gray-900 duration-1000"
                    >
                      Yes
                    </button>
                    <button
                      onClick={() =>
                        setPopUpclearWifi((popUp_clearWifi) => !popUp_clearWifi)
                      }
                      className="bg-gray-600 shadow-md px-6 hover:bg-gray-800 py-2 rounded-md shadow-gray-900 text-white  text-xl duration-1000"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {popup_btn && (
        <PopUpBtn
          setPopUpBtn={() => {
            setPopUpBtn(!popup_btn);
          }}
          setButtons={setButtons}
        />
      )}
    </div>
  );
}

type CustomizeBtnType = {
  transmitter: {
    press: {
      label: any[];
    };
    toggle: {
      label: any[];
    };
    joy: {
      label: any[];
    };
  };
  reciever: {
    chart: any[];
  };
};

type PopUpBtnProps = {
  setPopUpBtn: (value: boolean) => void;
  setButtons: React.Dispatch<React.SetStateAction<ButtonProps[]>>;
};

const PopUpBtn = ({ setPopUpBtn, setButtons }: PopUpBtnProps) => {
  const [buttonCategory, setButtonCategory] = React.useState<string>("");
  const [buttonLabel, setButtonLabel] = React.useState<string>("");
  const [buttonCommand, setButtonCommand] = React.useState<string>("");
  const [buttonType, setButtonType] = React.useState<string>("");
  const customizeBtn: CustomizeBtnType = {
    transmitter: {
      press: {
        label: ["Dot", "Up", "Down", "Left", "Right"],
      },
      toggle: {
        label: ["Forward", "Backward", "Up", "Down", "Left", "Right"],
      },
      joy: { label: ["normol joy stick"] },
    },
    reciever: {
      chart: ["donut", "candle"],
    },
  };
  const [selectedType, setSelectedType] = useState<
    keyof CustomizeBtnType | null
  >(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);

  const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedType(event.target.value as keyof CustomizeBtnType);
    setButtonType(event.target.value as keyof CustomizeBtnType);
    setSelectedCategory(null);
    setSelectedLabel(null);
  };

  const handleCategoryChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedCategory(event.target.value);
    setButtonCategory(event.target.value);
    setSelectedLabel(null);
  };

  const handleLabelChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLabel(event.target.value);
    setButtonLabel(event.target.value);
  };

  const getCategoryOptions = (): string[] => {
    if (!selectedType) return [];
    return Object.keys(customizeBtn[selectedType]) as string[];
  };

  const getLabelOptions = (): string[] => {
    if (!selectedType || !selectedCategory) return [];

    let selectedData: string[] | { label: string[] } | undefined;

    if (selectedType in customizeBtn) {
      const selectedTypeData =
        customizeBtn[selectedType as keyof CustomizeBtnType];

      if (
        selectedType === "transmitter" &&
        selectedCategory in selectedTypeData
      ) {
        selectedData =
          selectedTypeData[selectedCategory as keyof typeof selectedTypeData];
      } else if (
        selectedType === "reciever" &&
        selectedCategory in selectedTypeData
      ) {
        selectedData =
          selectedTypeData[selectedCategory as keyof typeof selectedTypeData];
      }
    }

    return Array.isArray(selectedData)
      ? selectedData
      : selectedData?.label || [];
  };

  const handleSave = () => {
    const newButton: ButtonProps = {
      id: Date.now(),
      buttonType,
      buttonCategory,
      buttonLabel,
      buttonCommand,
    };
    setButtons((prevButtons) => [...prevButtons, newButton]);
    setButtonCategory("");
    setButtonLabel("");
    setButtonCommand("");
    setButtonType("");
    setPopUpBtn(false);
  };

  const [config_cmd, setConfigCMD] = useState<boolean>(false);

  return (
    <div
      className="fixed duration-1000 animate-appearance-in inset-0 flex items-center justify-center bg-gray-800 bg-opacity-45"
      onClick={() => setPopUpBtn(false)}
    >
      <div
        className="z-100 w-2/5  rounded-md bg-gray-600 px-16 pt-10 pb-5 grid place-items-start"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-wrap my-2 gap-4">
          <select
            className="px-4 py-1 border rounded mb-2"
            value={selectedType || ""}
            onChange={handleTypeChange}
          >
            <option value="">Select Type</option>
            {Object.keys(customizeBtn).map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          <select
            className="px-4 py-1 border rounded mb-2"
            value={selectedCategory || ""}
            onChange={handleCategoryChange}
            disabled={!selectedType}
          >
            <option value="">Select Category</option>
            {getCategoryOptions().map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <select
            className="px-4 py-1 border rounded mb-2"
            value={selectedLabel || ""}
            onChange={handleLabelChange}
            disabled={!selectedCategory}
          >
            <option value="">Select Label</option>
            {getLabelOptions().map((label: any) => (
              <option key={label} value={label}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div
          className={` ${
            selectedType == "transmitter" ? "animate-fastFade" : "hidden"
          } lg:flex  grid my-2 w-full  gap-5  `}
        >
          <button
            className={`${selectedType == "transmitter" ? "flex" : "hidden"} ${
              config_cmd
                ? " bg-blue-700 hover:bg-blue-600 text-white"
                : " hover:bg-gray-400 bg-white "
            } py-1 px-6 text-black rounded-lg shadow-md shadow-gray-700  hover:text-white line-clamp-1 h-fit `}
            onClick={() => setConfigCMD(!config_cmd)}
          >
            {config_cmd ? (
              <div>Config Command</div>
            ) : (
              <div>Default Command</div>
            )}
          </button>
          <div
            className={` ${
              !config_cmd && selectedType == "transmitter"
                ? "animate-fastFade"
                : "hidden"
            }`}
          >
            <select
              className="px-2 py-1 rounded-md bg-gray-500 text-white"
              onChange={(e) => setButtonCommand(e.target.value)}
            >
              <option selected>select command</option>
              <option value={"on"}>On</option>
              <option value={"off"}>Off</option>
              <option value={"up"}>Up</option>
              <option value={"down"}>Down</option>
              <option value={"left"}>Left</option>
              <option value={"right"}>Right</option>
              <option value={"forward"}>Forward</option>
              <option value={"backward"}>Backward</option>
            </select>
          </div>
        </div>

        <div
          className={` ${
            config_cmd ? "animate-fastFade" : "hidden"
          } flex my-2 w-full justify-start gap-2`}
        >
          <label className="text-white">Command: </label>
          <input
            type="text"
            className="py-1 lg:w-[120px] bg-black text-green-400  w-[120px] rounded-sm  px-4"
            placeholder=">/"
            value={buttonCommand}
            onChange={(e) => setButtonCommand(e.target.value)}
          />
        </div>
        <div className="my-4 w-full lg:flex grid lg:justify-center gap-2 items-start">
          <button
            className="px-8 py-1  enabled:opacity-100 opacity-60
            bg-blue-600 rounded-md text-white enabled:hover:opacity-80"
            onClick={handleSave}
            disabled={
              !buttonCategory && !buttonLabel && !buttonCommand && !buttonType
            }
          >
            Save
          </button>
          <button
            className="px-8 py-1 bg-red-500 rounded-md text-white hover:opacity-80"
            onClick={() => setPopUpBtn(false)}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
