import React from 'react'
import { bindActionCreators } from 'redux'
import { initStore, load, callService } from '../store'
import withRedux from 'next-redux-wrapper'

import App from '../components/App';
import Switch from '../components/Switch';


class Living extends React.Component {
  constructor(props) {
    super(props);
    this.entityName = 'light.living_level';
  }

  componentDidMount () {
    this.props.load();
  }

  changed = (service, entityName) => {
    this.props.callService('homeassistant', service, {
      entity_id: entityName
    });
  }

  render () {
    const Left = (
      <div style={{...container}}>
        <Switch
          entityName={this.entityName}
          changed={this.changed}
          label="Couch"
        />
      </div>
    );
    return (
      <App left={Left} />
    )
  }
}

const container = {
  display: 'flex',
  height: '100vh',
  flexDirection: 'column',
}

const mapDispatchToProps = (dispatch) => {
  return {
    load: bindActionCreators(load, dispatch),
    callService: bindActionCreators(callService, dispatch),
  }
}

export default withRedux(initStore, null, mapDispatchToProps)(Living)