package de.andrano.mobilebattery;

import android.content.Context;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.net.wifi.WifiInfo;
import android.net.wifi.WifiManager;

/**
 * Created by Andreas on 12.07.15.
 */
public class Wireless {

    private Context context;
    private WifiManager wifiManager;

    public Wireless(Context context) {
        this.context = context;
        wifiManager = (WifiManager) context.getSystemService("wifi");
    }

    public String getCurrentSSID() {
        return getCurrentNetwork().getSSID().replace("\"", "");
    }

    public WifiInfo getCurrentNetwork() {
        return wifiManager.getConnectionInfo();
    }

    public boolean isEnabled() {
        return wifiManager.isWifiEnabled();
    }

    public boolean isConnected() {
        ConnectivityManager connManager = (ConnectivityManager) context.getSystemService(Context.CONNECTIVITY_SERVICE);
        NetworkInfo mWifi = connManager.getNetworkInfo(ConnectivityManager.TYPE_WIFI);
        return mWifi.isConnected();
    }

}
