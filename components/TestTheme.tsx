import { createTheme, lightColors } from "@rneui/themed";
import { Platform } from "react-native";

const testTheme = createTheme({
    components: {
        Button: {
            title: "Dark",
            buttonStyle: { backgroundColor: 'rgba(39, 39, 39, 1)' },
            containerStyle: {
              width: 200,
              marginHorizontal: 50,
              marginVertical: 10,
              borderRadius: 10,
            },
            titleStyle: { color: 'white', marginHorizontal: 20 }
        },
      },

    lightColors: {
        ...Platform.select({
            default: lightColors.platform.android,
            ios: lightColors.platform.ios,
        }),
    },
});

  export default testTheme