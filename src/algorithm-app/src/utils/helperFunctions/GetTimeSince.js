// Time calculation helper function
const getTimeDisplay = (createdAt) => {
  const now = new Date();
  const commentDate = new Date(createdAt);
  const diffMs = now - commentDate; // Time difference in milliseconds
  const diffMinutes = Math.floor(diffMs / (1000 * 60));

  if (diffMinutes < 5) {
    return "recently";
  } else if (diffMinutes < 60) {
    return `${diffMinutes} minutes ago`;
  } else if (diffMinutes < 1440) {
    const diffHours = Math.floor(diffMinutes / 60);
    return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  } else if (diffMinutes < 10080) {
    const diffDays = Math.floor(diffMinutes / 1440);
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  } else if (diffMinutes < 43200) {
    const diffWeeks = Math.floor(diffMinutes / 10080);
    return `${diffWeeks} week${diffWeeks > 1 ? 's' : ''} ago`;
  } else if (diffMinutes < 525600) {
    const diffMonths = Math.floor(diffMinutes / 43200);
    return `${diffMonths} month${diffMonths > 1 ? 's' : ''} ago`;
  } else {
    const diffYears = Math.floor(diffMinutes / 525600);
    return `${diffYears} year${diffYears > 1 ? 's' : ''} ago`;
  }
};
export default getTimeDisplay;