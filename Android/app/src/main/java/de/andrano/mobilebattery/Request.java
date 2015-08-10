package de.andrano.mobilebattery;

import android.content.Context;
import android.content.SharedPreferences;
import android.os.AsyncTask;
import android.util.Log;

import org.json.JSONObject;

/**
 * Created by Andreas on 17.07.15.
 */
public class Request {

    private Connection connection;

    private Callback callback = null;

    public Request(Connection connection) {
        this.connection = connection;
    }

    public void asyncRequest(String path, String data) {
        this.asyncRequest(path, data, null, String.valueOf(-1));
    }

    public void asyncRequest(String path, String data, String ip, String port) {
        new AsyncTask<String, Integer, Boolean>() {

            @Override
            protected Boolean doInBackground(String... params) {
                String result = connection.httpRequest(params[0], Integer.valueOf(params[1]), params[2], params[3]);
                Log.d("result", result);
                return connection.parseResult(result);
            }

            @Override
            protected void onPostExecute(Boolean b) {
                super.onPostExecute(b);
                //Callback
                if (callback != null) {
                    callback.callback(b);
                }
            }
        }.execute(ip, port, path, data);
    }

    public void setCallback(Callback callback) {
        this.callback = callback;
    }
}
