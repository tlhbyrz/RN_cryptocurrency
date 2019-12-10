import React, { Component } from "react";
import {
  Text,
  StyleSheet,
  View,
  Picker,
  ActivityIndicator,
  TouchableOpacity
} from "react-native";

export default class App extends Component {
  state = {
    currency: "",
    crypto: "",
    price: null,
    change: "",
    cryptoList: [],
    loading: true,
    error: ""
  };

  async componentDidMount() {
    try {
      const res = await fetch("https://api.coinmarketcap.com/v1/ticker/");
      const data = await res.json();
      this.setState({ cryptoList: data, loading: false });
    } catch (error) {
      this.setState({ error: error.message });
    }
  }

  _showPrice = async () => {
    try {
      const res = await fetch(
        `https://api.coinmarketcap.com/v1/ticker/${this.state.crypto}?convert=USD`
      );
      const data = await res.json();
      this.setState({
        price: data[0].price_usd,
        change: data[0].percent_change_24h
      });
      console.log("price", data[0].price_usd);
    } catch (error) {
      this.setState({ error: error.message });
    }
  };

  render() {
    return (
      <View style={styles.container}>
        {this.state.loading ? (
          <ActivityIndicator size="large" color="red" />
        ) : (
          <View style={styles.card}>
            <Text style={styles.mainTitle}> Cryptocurrency Converter </Text>

            <Picker
              style={styles.picker}
              selectedValue={this.state.currency}
              onValueChange={(itemValue, itemIndex) =>
                this.setState({ currency: itemValue })
              }
            >
              {/*   
               <Picker.Item label="Turkey" value="TR" />
               <Picker.Item label="Canada" value="CAD" />
               <Picker.Item label="Europa" value="EURO" /> */}

              <Picker.Item label="Dollar" value="USD" />
            </Picker>

            <Picker
              style={styles.picker}
              selectedValue={this.state.crypto}
              onValueChange={(itemValue, itemIndex) =>
                this.setState({ crypto: itemValue, price: null })
              }
            >
              {this.state.cryptoList.map((crypto, index) => (
                <Picker.Item label={crypto.id} value={crypto.id} key={index} />
              ))}
            </Picker>
          </View>
        )}

        {this.state.loading ? null : (
          <TouchableOpacity onPress={this._showPrice} style={styles.button}>
            <Text style={styles.buttonText}>Convert</Text>
          </TouchableOpacity>
        )}

        {this.state.price ? (
          <View style={styles.container}>
            <Text style={styles.priceText}>{this.state.crypto}</Text>
            <Text style={styles.priceText}>Price : {this.state.price} $</Text>
            <Text style={styles.priceText}>
              24h change : {this.state.change}%
            </Text>
          </View>
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    alignItems: "center"
  },
  card: {
    width: "90%",
    backgroundColor: "#ccc",
    borderRadius: 10,
    elevation: 5,
    padding: 10,
    alignItems: "center"
  },
  mainTitle: {
    fontSize: 18,
    color: "black",
    fontWeight: "700"
  },
  picker: {
    width: "50%",
    height: 50,
    marginTop: 5
  },
  button: {
    width: "90%",
    backgroundColor: "black",
    borderRadius: 8,
    marginTop: 10,
    padding: 10,
    alignItems: "center"
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700"
  },
  priceText: {
    width: "90%",
    height: 50,
    fontSize: 20,
    color: "black",
    textAlign: "center",
    marginTop: 10
  }
});
