
const generateAnnouncementId = () => {
  const randomNumber = Math.floor(
    1000000000 + Math.random() * 9000000000
  );

  return `ANN${randomNumber}`;
};

export default generateAnnouncementId;
