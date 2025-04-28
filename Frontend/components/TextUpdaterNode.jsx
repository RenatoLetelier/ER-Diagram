import { useState } from "react";
import { Handle, Position } from "@xyflow/react";
import "./TextUpdaterNode.css";

export default function TextUpdaterNode(nodes) {
  const [rows, setRows] = useState([]);
  const [rowsId, setRowsId] = useState(0);

  const addColumn = () => {
    setRows((prevRows) => [
      ...prevRows,
      { id: rowsId, name: `col${rowsId}`, type: "string" },
    ]);
    setRowsId((prevId) => prevId + 1);
  };

  return (
    <div className="text-updater-node">
      <div>
        <strong>{nodes.data.tableName}</strong>
        <ul style={{ listStyleType: "none", padding: 0, position: "relative" }}>
          {rows.map((row, index) => (
            <li
              key={index}
              style={{ position: "relative", paddingRight: "20px" }}
            >
              {row.name} ({row.type})
              <Handle
                type="source"
                position={Position.Right}
                id={`handle-${index}`}
                style={{
                  right: "-5px",
                }}
                isConnectable={true}
              />
              <Handle
                type="input"
                position={Position.Left}
                id={`handle-${index}`}
                style={{
                  left: "-5px",
                }}
                isConnectable={true}
              />
            </li>
          ))}
        </ul>
        <button onClick={() => addColumn()}>+</button>
      </div>
    </div>
  );
}
