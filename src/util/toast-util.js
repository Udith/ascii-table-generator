import {Position, Toaster, Intent} from "@blueprintjs/core";
import {IconNames} from "@blueprintjs/icons";

const toaster = Toaster.create({
    position: Position.BOTTOM_RIGHT
});

/**
 * @author Udith Gunaratna
 */
class ToastUtil {

    showSuccessToast = (message) => {
        toaster.show({
            message,
            icon: IconNames.TICK,
            intent: Intent.SUCCESS,
            timeout: 2000
        })
    }
}

export const TOAST_UTIL = new ToastUtil();
