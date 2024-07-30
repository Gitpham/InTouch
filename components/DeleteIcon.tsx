import { Image } from "react-native"
import { styles } from "@/constants/Stylesheet";

export const DeleteIcon = () => {
    return (<Image
    style={styles.tinyLogo}
    source={require('@/assets/images/x_icon.jpg')}
  />);
}