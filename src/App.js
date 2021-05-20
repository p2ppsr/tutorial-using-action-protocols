import './App.css';
import { createAction } from '@babbage/sdk';
import { Button } from '@material-ui/core';

function App () {
  const handleClick = async () => {
    const result = await createAction({
      // We provide a present-tense description of what is being done
      description: 'Create my first Action',

      // Here, we just specify which of the users keys to use.
      // You can ignore this for now, but it will be important later.
      keyName: 'primarySigning',
      keyPath: 'm/1033/1',

      // Finally, we specify the data for this Action.
      // This is an array of fields that go into a Bitcoin transaction.
      data: [
        /*
          All strings need to be in base64 format, so we'll use the built-in 
          "btoa" function to convert our message.
        */
        btoa('Hello Babbage, my name is Ty')
        // Change this to your own name ^
      ]
    })

    // Finally, let's see what we get when we create the Action!
    console.log(result)
    alert(`txid: ${result.txid}`)
  }

  return (
    <div className="App">
      <header className="App-header">
        <Button
          variant='contained'
          color='primary'
          size='large'
          onClick={handleClick}
        >
          Create Action
        </Button>
      </header>
    </div>
  );
}

export default App;
