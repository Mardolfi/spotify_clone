import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './components/pages/Login';
import Home from './components/pages/Home';
import Search from './components/pages/Search';
import YourLibrary from './components/pages/YourLibrary';
import Playlist from './components/pages/Playlist';
import Categories from './components/pages/Categories';
import Music from './components/pages/Music';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' exact element={<Home />}/>
        <Route path='/login' element={<Login />}/>
        <Route path='/search'element={<Search />}/>
        <Route path='/yourlibrary'element={<YourLibrary />}/>
        <Route path='/playlist/:id'element={<Playlist />}/>
        <Route path='/categories/:id'element={<Categories />}/>
        <Route path='/album/:id'element={<Music />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
