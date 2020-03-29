import React from 'react';
import PlacesAutocomplete, {
    geocodeByAddress,
    getLatLng,
  } from 'react-places-autocomplete';

import './AddressForm.css';

const AddressForm = props => {

    const [address, setAddress] = React.useState('');
    const [latlngs, setLatlngs] = React.useState([]);
    const [addrList, setAddrList] = React.useState([])

    React.useEffect(() => {
        if (props.addrToDelete) {
            setAddrList(addrList.filter(item => item !== props.addrToDelete));
        }
    }, [props.addrToDelete])

    // here, we'll set the latlng object we get to some piece of state
    const handleSelect = addr => {
        // make sure addr in search bar is changed even if
        // clicked on (as opposed to pressing enter)
        setAddress(addr);
        geocodeByAddress(addr)
            .then(results => getLatLng(results[0]))
            .then(latlng => {
                setLatlngs(prev => [...prev, latlng]);
            }
            )
            .catch(error => console.error(error))
        setAddrList(prev => {
            const newList = [...prev, addr];
            props.setParentAddrList(newList);
            return newList;
        });
    }

    return (
        <PlacesAutocomplete
          value={address}
          onChange={addr => setAddress(addr)}
          onSelect={handleSelect}
        >
          {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
            <div className="input-group mb-3" style={{ display: 'block', width: '90%' }}>
                <div className="input-group-prepend">
                <span className="input-group-text" id="basic-addon1">Address</span>
                <input
                    {...getInputProps({
                    placeholder: 'Search Places ...',
                    className: 'form-control',
                    })}
              />
              <span onClick={() => setAddress('')} className="btn btn-xs btn-default">
                <i className="fas fa-times"></i>
              </span>
            </div>
              <div className="autocomplete-dropdown-container">
                {loading && <div>Loading...</div>}
                {suggestions.map(suggestion => {
                  const style = suggestion.active
                    ? { backgroundColor: '#ffffff', cursor: 'pointer', borderTop: '1px solid gray' }
                    : { backgroundColor: '#cac7c7', cursor: 'pointer', borderTop: '1px solid gray' };
                  return (
                    <div
                      {...getSuggestionItemProps(suggestion, {
                        style,
                      })}
                    >
                      <span>{suggestion.description}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </PlacesAutocomplete>
    )
}

export default AddressForm;