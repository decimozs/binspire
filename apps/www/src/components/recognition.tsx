export default function Recognition() {
  return (
    <div className="bg-yellow-200 overflow-hidden whitespace-nowrap">
      <div className="marquee">
        {Array.from({ length: 6 }).map((_, i) => (
          <span key={i} className="marquee-text">
            🏆 Won 1st Runner-Up in the IoT Category at the IT Skills Olympics
          </span>
        ))}
      </div>
    </div>
  );
}
