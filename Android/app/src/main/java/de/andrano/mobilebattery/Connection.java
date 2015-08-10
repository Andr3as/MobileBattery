package de.andrano.mobilebattery;

import android.content.Context;
import android.content.SharedPreferences;
import android.os.AsyncTask;
import android.util.Log;
import android.widget.ExpandableListView;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedInputStream;
import java.io.InputStream;
import java.io.PrintWriter;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Scanner;

/**
 * Created by Andreas on 12.07.15.
 */
public class Connection {

    private String key;
    private String handshake;
    private String[] ips;
    private String ip;
    private int port;

    private Exception error = null;

    public Connection(JSONObject obj) {
        try {
            this.key = obj.getString("key");
            this.port = obj.getInt("port");
            this.handshake = obj.getString("handshake");
        } catch (Exception e) {
            this.error = e;
        }
    }

    /* Getters */

    public Exception getError() {
        return this.error;
    }

    public String getHandshake() {
        return this.handshake;
    }

    public String getIp() {
        return this.ip;
    }

    public String[] getIps() {
        return this.ips;
    }

    public int getPort() {
        return this.port;
    }

    /* Setters */

    public void setIp(String ip) {
        this.ip = ip;
    }

    public void setIps(String[] ips) {
        this.ips = ips;
    }


    /* Public methods */
    public String decodeString(String string) {
        return string;
    }

    public String encodeString(String string) {
        return string;
    }

    public String toString() {
        return "{ip:\"" + this.ip + "\",port:" + this.port + " , key:" + this.key + ", handshake: \"" + this.handshake + "\"}";
    }

    public boolean hasError() {
        if (this.error != null) {
            return true;
        } else {
            return false;
        }
    }

    public static boolean parseResult(String json) {
        if (json == null || json.isEmpty()) {
            return false;
        }
        try {
            JSONObject obj = new JSONObject(json);
            return obj.getBoolean("result");
        } catch (Exception e) {
            Log.e("parseResult", e.toString());
            return false;
        }

    }

    public String httpRequest(String ip, int port, String path, String data) {
        if (ip == null) {
            ip = this.ip;
        }
        if (port == -1) {
            port = this.port;
        }

        try {
            URL url = new URL("http", ip, port, path);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();

            Log.d("url", url.toString());
            if (data != null && !data.isEmpty()) {
                Log.d("post data", data);
                connection.setDoOutput(true);
                connection.setRequestMethod("POST");
                connection.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");

                connection.setFixedLengthStreamingMode(data.getBytes().length);
                PrintWriter out = new PrintWriter(connection.getOutputStream());
                out.print(data);
                out.close();
            }

            InputStream in = new BufferedInputStream(connection.getInputStream());
            return getResponseText(in);
        } catch (Exception e) {
            Log.e("httpRequest",e.toString());
            return e.toString();
        }
    }

    /* Private methods */

    private static String getResponseText(InputStream inStream) {
        // very nice trick from
        // http://weblogs.java.net/blog/pat/archive/2004/10/stupid_scanner_1.html
        return new Scanner(inStream).useDelimiter("\\A").next();
    }
}
