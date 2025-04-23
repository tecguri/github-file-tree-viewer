import React, { useEffect, useState } from 'react'

export default function Home() {

  const [data, setData] = useState({});
  const [files, setFiles] = useState({});

  useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("https://api.github.com/repos/facebook/react/git/trees/main?recursive=0");
                if (!response.ok) {
                  throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const result = await response.json();
                // console.log("response", result);

                const root = {};
                result.tree && result?.tree.forEach(item => {
                  const parts = item.path.split('/');
                  let current = root;

                  parts.forEach((part, index) => {
                    if (index === parts.length - 1) {
                      current[part] = null;
                    } else {
                      if (!current[part]) {
                        current[part] = {};
                      }
                      current = current[part];
                    }
                  });
                });

                setData(root);
            } catch (error) {
                console.log(error);
            }
        }
        fetchData();
    }, []);

    // console.log(data);


    const [openFolders, setOpenFolders] = useState({});

    const toggleFolder = (path) => {
      setOpenFolders((prev) => ({
        ...prev,
        [path]: !prev[path],
      }));
    };

    const renderTree = (node, parentPath = '') => {
      const sortedEntries = Object.entries(node).sort(([keyA, valA], [keyB, valB]) => {
        const isDirA = valA !== null;
        const isDirB = valB !== null;
    
        if (isDirA && !isDirB) return -1;
        if (!isDirA && isDirB) return 1;
    
        return keyA.localeCompare(keyB);
      });
    
      return sortedEntries.map(([key, value]) => {
        const fullPath = parentPath ? `${parentPath}/${key}` : key;
        const isOpen = openFolders[fullPath];
    
        if (value === null) {
          return <li key={fullPath}>📄 {key}</li>;
        } else {
          return (
            <li key={fullPath}>
              <span
                onClick={() => toggleFolder(fullPath)}
                style={{ cursor: 'pointer', fontWeight: 'bold' }}
              >
                {isOpen ? '📂' : '📁'} {key}
              </span>
              {isOpen && (
                <ul style={{ marginLeft: 20 }}>
                  {renderTree(value, fullPath)}
                </ul>
              )}
            </li>
          );
        }
      });
    };
    

    return (
      <>

          <div style={{ padding: 20 }}>
            
            <ul>
              {Object.keys(data).length > 0 ? renderTree(data) : <p>Loading...</p>}
            </ul>
          </div>

      </>
    )
  
}
