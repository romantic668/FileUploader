import './App.css';
import FileList from './components/FileList';
import File from './components/File';

import { BrowserRouter as Router, Switch } from 'react-router-dom';
import IconSettings from '@salesforce/design-system-react/components/icon-settings';

const Route = require("react-router-dom").Route;

function App() {
  return (
    <IconSettings iconPath="/icons">
      <Router>

        <div className="App">
          <Switch>
            <Route path="/(|home)/" exact>
              <FileList />

            </Route>
            <Route path="/files/:id">
              <File />

            </Route>

          </Switch>
        </div>

      </Router>
    </IconSettings >
  );
}

export default App;
