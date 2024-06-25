import React, { createContext, useState, useEffect } from "react";
import MakeApiRequest from "../Functions/AxiosApi";
import config from "../Functions/config";
import Cookies from "js-cookie";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const token = Cookies.get("token");
  const [notifications, setNotifications] = useState({
    notification: [],
    unreadnotificationcount: 0,
  });

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const updateNotification = () => {
    MakeApiRequest(
      "get",
      `${config.baseUrl}adminn/getallnotification/`,
      headers,
      {},
      {}
    )
      .then((response) => {
        console.log("notification", response);
        setNotifications(response);
      })
      .catch((error) => {
        console.error("Error:", error);
        if (error.response && error.response.status === 401) {
          console.log(
            "Unauthorized access. Token might be expired or invalid."
          );
        } else {
          console.error("Unexpected error occurred:", error);
        }
      });
  };

  useEffect(() => {
    updateNotification();
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications, setNotifications, updateNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
