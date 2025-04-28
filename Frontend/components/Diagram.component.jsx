import { useCallback, useState } from "react";
import {
  ReactFlow,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  MiniMap,
  Controls,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import TextUpdaterNode from "./TextUpdaterNode";

const rfStyle = {
  backgroundColor: "#B8CEFF",
};

const initialNodes = [
  {
    id: "node-1",
    type: "textUpdater",
    position: { x: 0, y: 0 },
    data: {
      tableName: "Entidad 1",
    },
  },
];
const nodeTypes = { textUpdater: TextUpdaterNode };

export default function FlowDiagram() {
  const [entitiesCount, setEntitiesCount] = useState(0);
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState([]);

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );
  // const onConnect = useCallback(
  //   (connection) => setEdges((eds) => addEdge(connection, eds)),
  //   [setEdges]
  // );
  const onConnect = useCallback(
    (params) => {
      const sourceNode = nodes.find((n) => n.id === params.source);
      const targetNode = nodes.find((n) => n.id === params.target);

      if (!sourceNode || !targetNode) return;

      const pkColumn = sourceNode.data.columns.find((col) => col.type === "PK");
      if (pkColumn) {
        targetNode.data.columns.push({
          name: `${sourceNode.data.tableName}_${pkColumn.name}`,
          type: "FK",
        });

        setNodes([...nodes]);
      }

      setEdges((eds) => addEdge(params, eds));
    },
    [nodes, setEdges, setNodes]
  );

  const handleNodeDoubleClick = (event, node) => {
    const newTableName = prompt(
      "Ingrese nuevo nombre para la tabla:",
      node.data.tableName
    );
    if (newTableName) {
      setNodes((nds) =>
        nds.map((nd) =>
          nd.id === node.id
            ? { ...nd, data: { ...nd.data, tableName: newTableName } }
            : nd
        )
      );
    }
  };

  const addNode = () => {
    setNodes((nds) => [
      ...nds,
      {
        id: `${entitiesCount}`,
        position: { x: Math.random() * 100, y: Math.random() * 100 },
        data: {
          tableName: `New entity ${entitiesCount}`,
        },
      },
    ]);
    setEntitiesCount(entitiesCount + 1);
  };

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <button
        onClick={addNode}
        style={{
          marginBottom: "10px",
          backgroundColor: "#242424",
          color: "white",
          padding: "10px",
          borderRadius: "5px",
        }}
      >
        Agregar Tabla
      </button>
      <ReactFlow
        nodes={nodes.map((node) => ({ ...node, type: "textUpdater" }))}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        onNodeDoubleClick={handleNodeDoubleClick}
        fitView
        style={rfStyle}
      >
        <MiniMap />
        <Controls />
      </ReactFlow>
    </div>
  );
}
