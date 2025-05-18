import React, { useState, useEffect } from 'react';
import ModalPopup from '../../components/common/ModalPopup';
import styles from '../../styles/ManageHeroSection.module.css';
import adminApi from '../../api/adminApi';
import { useSelector } from 'react-redux';

const defaultBanner = {
  type: 'ad',
  title: '',
  subtitle: '',
  description: '',
  media: {
    imageUrl: '',
    mobileImageUrl: '',
    videoUrl: '',
    altText: '',
  },
  cta: {
    text: '',
    link: '',
    type: 'internal',
    trackClick: true,
  },
  isActive: true,
  personalizationTags: ['all'],
  targetCanteens: [],
  schedule: {
    startDate: '',
    endDate: '',
    timeZone: 'UTC',
  },
  displayRules: {
    platforms: ['web', 'mobile'],
    maxImpressionsPerUser: 5,
  },
  analytics: {
    views: 0,
    clicks: 0,
  },
  createdBy: null,
};

const ManageHeroSection = () => {
  const [banners, setBanners] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentBanner, setCurrentBanner] = useState(defaultBanner);
  const [canteens,setCanteens] = useState(null);
  const [selectedCanteenIds, setSelectedCanteenIds] = useState([]);
  const { user } = useSelector((state) => state.auth || {});

  const fetchBanners = async () => {
    try {
      const res = await adminApi.getAllBanners();
      setBanners(res.data);
    } catch (error) {
      console.error('Failed to fetch banners:', error);
    }
  };

  const fetchCanteens = async () => {
    try{
        const res = await adminApi.fetchCanteens();
        await setCanteens(res.data.canteens);
    }catch(error){
        console.log("Failed to fetch canteens : ",error);
    }
  }

  useEffect(() => {
    fetchBanners();
    fetchCanteens();
  }, []);

  const handleEdit = (banner) => {
    setCurrentBanner(banner);
    setIsEditMode(true);
    setModalOpen(true);
  };

  const handleCreate = () => {
    setCurrentBanner(defaultBanner);
    setIsEditMode(false);
    setModalOpen(true);
  };

  const handleCanteenSelect = (id) => {
    setSelectedCanteenIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(canteenId => canteenId !== id); 
      }
      return [...prev, id]; 
    });
  };
  

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this banner?')) return;
    try {
      const res = await adminApi.deleteBanner(id);
      fetchBanners();
    } catch (error) {
      console.error('Failed to delete banner:', error);
    }
  };

  const handleSave = async () => {
    try {
        const bannerContent = currentBanner;
        const updatedBannerContent = {
            ...bannerContent,
            targetCanteens : selectedCanteenIds,
            createdBy : user?.id,
        }
      if (isEditMode) {
        await adminApi.updateBanner(currentBanner._id ,updatedBannerContent);
      } else {
        await adminApi.postBanner(updatedBannerContent);
      }
      setModalOpen(false);
      fetchBanners();
    } catch (error) {
      console.error('Failed to save banner:', error);
    }
  };

  return (
    <div className={styles.container}>
      <h1>Manage Hero Banners</h1>
      <button onClick={handleCreate} className={styles.createButton}>+ Create Banner</button>

      <div className={styles.bannerList}>
        {banners.map((banner) => (
          <div key={banner._id} className={styles.bannerCard}>
            <img src={banner.media.imageUrl} alt={banner.media.altText || 'Banner'} />
            <div className={styles.bannerDetails}>
              <h3>{banner.title}</h3>
              <p>{banner.subtitle}</p>
              <p>Type: {banner.type}</p>
              <div className={styles.actions}>
                <button onClick={() => handleEdit(banner)} className={styles.editButton}>Edit</button>
                <button onClick={() => handleDelete(banner?._id)} className={styles.deleteButton}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ModalPopup
        isOpen={modalOpen}
        title={isEditMode ? 'Edit Banner' : 'Create Banner'}
        onClose={() => setModalOpen(false)}
        buttons={[
          { label: isEditMode ? 'Update' : 'Create', onClick: handleSave, variant: 'primary' },
          { label: 'Cancel', onClick: () => setModalOpen(false), variant: 'secondary' },
        ]}
      >
        <form className={styles.modalForm}>
          <label>Title:<input type="text" value={currentBanner.title} onChange={(e) => setCurrentBanner({ ...currentBanner, title: e.target.value })} /></label>
          <label>Subtitle:<input type="text" value={currentBanner.subtitle} onChange={(e) => setCurrentBanner({ ...currentBanner, subtitle: e.target.value })} /></label>
          <label>Description:<textarea value={currentBanner.description} onChange={(e) => setCurrentBanner({ ...currentBanner, description: e.target.value })} /></label>
          <label>Type:<select value={currentBanner.type} onChange={(e) => setCurrentBanner({ ...currentBanner, type: e.target.value })}>
            <option value="ad">Ad</option>
            <option value="offer">Offer</option>
            <option value="system">System</option>
            <option value="event">Event</option>
            <option value="announcement">Announcement</option>
          </select></label>
          <label>Image URL:<input type="text" value={currentBanner.media.imageUrl} onChange={(e) => setCurrentBanner({ ...currentBanner, media: { ...currentBanner.media, imageUrl: e.target.value } })} /></label>
          <label>Mobile Image URL:<input type="text" value={currentBanner.media.mobileImageUrl} onChange={(e) => setCurrentBanner({ ...currentBanner, media: { ...currentBanner.media, mobileImageUrl: e.target.value } })} /></label>
          <label>Video URL:<input type="text" value={currentBanner.media.videoUrl} onChange={(e) => setCurrentBanner({ ...currentBanner, media: { ...currentBanner.media, videoUrl: e.target.value } })} /></label>
          <label>Alt Text:<input type="text" value={currentBanner.media.altText} onChange={(e) => setCurrentBanner({ ...currentBanner, media: { ...currentBanner.media, altText: e.target.value } })} /></label>
          <label>CTA Text:<input type="text" value={currentBanner.cta.text} onChange={(e) => setCurrentBanner({ ...currentBanner, cta: { ...currentBanner.cta, text: e.target.value } })} /></label>
          <label>CTA Link:<input type="text" value={currentBanner.cta.link} onChange={(e) => setCurrentBanner({ ...currentBanner, cta: { ...currentBanner.cta, link: e.target.value } })} /></label>
          <label>CTA Type:<select value={currentBanner.cta.type} onChange={(e) => setCurrentBanner({ ...currentBanner, cta: { ...currentBanner.cta, type: e.target.value } })}>
            <option value="internal">Internal</option>
            <option value="external">External</option>
          </select></label>
          <label>Track Click:<input type="checkbox" checked={currentBanner.cta.trackClick} onChange={(e) => setCurrentBanner({ ...currentBanner, cta: { ...currentBanner.cta, trackClick: e.target.checked } })} /></label>
          <label>Start Date:<input type="date" value={currentBanner.schedule.startDate?.split('T')[0]} onChange={(e) => setCurrentBanner({ ...currentBanner, schedule: { ...currentBanner.schedule, startDate: e.target.value } })} /></label>
          <label>End Date:<input type="date" value={currentBanner.schedule.endDate?.split('T')[0]} onChange={(e) => setCurrentBanner({ ...currentBanner, schedule: { ...currentBanner.schedule, endDate: e.target.value } })} /></label>
          <label>Time Zone:<input type="text" value={currentBanner.schedule.timeZone} onChange={(e) => setCurrentBanner({ ...currentBanner, schedule: { ...currentBanner.schedule, timeZone: e.target.value } })} /></label>
          <label>Platforms:<input type="text" value={currentBanner.displayRules.platforms.join(', ')} onChange={(e) => setCurrentBanner({ ...currentBanner, displayRules: { ...currentBanner.displayRules, platforms: e.target.value.split(',').map(p => p.trim()) } })} /></label>
          <label>Max Impressions/User:<input type="number" value={currentBanner.displayRules.maxImpressionsPerUser} onChange={(e) => setCurrentBanner({ ...currentBanner, displayRules: { ...currentBanner.displayRules, maxImpressionsPerUser: parseInt(e.target.value, 10) } })} /></label>
          {canteens?.map(c => (
            <div key={c._id}>
                <label>
                 TargetCanteens
                <input
                    type="checkbox"
                    value={c._id}
                    checked={selectedCanteenIds.includes(c._id)}
                    onChange={() => handleCanteenSelect(c._id)}
                />
                {c.name}
                </label>
            </div>
            ))}

          <label>Personalization Tags:<input type="text" value={currentBanner.personalizationTags.join(', ')} onChange={(e) => setCurrentBanner({ ...currentBanner, personalizationTags: e.target.value.split(',').map(tag => tag.trim()) })} /></label>
          <label>Is Active:<input type="checkbox" checked={currentBanner.isActive} onChange={(e) => setCurrentBanner({ ...currentBanner, isActive: e.target.checked })} /></label>
          <label>CreatedBy : {user?.username}</label>
        </form>
      </ModalPopup>
    </div>
  );
};

export default ManageHeroSection;