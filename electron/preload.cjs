const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('solutionDesk', {
  runtime: 'electron',
});
