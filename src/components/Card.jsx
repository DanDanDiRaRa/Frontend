import "./Card.css";

function Card({ title, desc, onClick, index }) {
  return (
    <div className="card" onClick={onClick}>
      {index && <span className="card-index">{index}</span>}
      <div className="card-body">
        <strong className="card-title">{title}</strong>
        {desc && <span className="card-desc">{desc}</span>}
      </div>
    </div>
  );
}

export default Card;