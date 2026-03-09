import { apiClient } from "@/utils/api-client";
import { GET_PROFILE_URL } from "@/utils/constants";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Profile = () => {
  const { userId } = useParams();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({});
  const [editable, setEditable] = useState(false);
  const [projects, setProjects] = useState([]);

  const getUser = async () => {
    if (!userId) return;
    await apiClient.get(GET_PROFILE_URL(userId)).then((res) => {
      console.log(res.data);
    });
  };

  useEffect(() => {
    getUser();
  }, []);

  return <div>Profile</div>;
};

export default Profile;
