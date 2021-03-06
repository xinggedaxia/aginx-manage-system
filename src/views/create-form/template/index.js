import renderMain from './components/Main.template'
import renderSearchBar from './components/SearchBar.template'
import renderTable from './components/Table.template'
import renderDialog from './components/Dialog.template'
import renderFilter from './components/Filter.template'
import renderData from './components/Data.template'
import renderMethod from './components/Method.template'
import renderStyle from './components/Style.template'

const startRender = (config) => {
  return renderMain(
    config.pageName,
    renderSearchBar(config),
    renderTable(config).trim(),
    renderDialog(config),
    renderFilter(config).trim(),
    renderData(config),
    renderMethod(config),
    renderStyle(config)
  ).trim()
}

export default startRender

