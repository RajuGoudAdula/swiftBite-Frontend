import { useState, useEffect } from "react";
import Card from "../../components/common/Card";
import CardContent from "../../components/common/CardContent";
import Button from "../../components/common/Button";
import canteenApi from "../../api/canteenApi";

const CanteenProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await canteenApi.getCanteenProfile();
      setProfile(response.data);
    } catch (error) {
      console.error("Failed to fetch profile", error);
    }
    setLoading(false);
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Canteen Profile</h1>

      {loading ? (
        <p>Loading profile...</p>
      ) : (
        profile && (
          <Card className="p-4">
            <CardContent>
              <h2 className="text-lg font-semibold">{profile.name}</h2>
              <p className="text-sm text-gray-500">{profile.email}</p>
              <p className="text-sm text-gray-500">{profile.phone}</p>
              <p className="text-sm text-gray-500">{profile.location}</p>
            </CardContent>
            <Button className="mt-4">Edit Profile</Button>
          </Card>
        )
      )}
    </div>
  );
};

export default CanteenProfile;
