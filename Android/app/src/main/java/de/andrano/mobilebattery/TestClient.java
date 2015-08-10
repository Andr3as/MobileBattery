package de.andrano.mobilebattery;

import android.content.Context;
import android.content.SharedPreferences;
import android.os.AsyncTask;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.ProgressBar;
import android.widget.RelativeLayout;
import android.widget.Toast;

/**
 * Created by Andreas on 12.07.15.
 */
public class TestClient extends AsyncTask<String, Integer, Boolean> {

    Connection connection;

    MainActivity activity;
    ProgressBar progressBar_1;
    ProgressBar progressBar_2;
    Button scanButton;
    Button stopButton;

    public TestClient(Connection connection, MainActivity activity) {
        this.connection = connection;
        this.activity = activity;

        //Get elements
        this.progressBar_1 = (ProgressBar) this.activity.findViewById(R.id.progressBar_1);
        this.progressBar_2 = (ProgressBar) this.activity.findViewById(R.id.progressBar_2);
        this.scanButton = (Button) this.activity.findViewById(R.id.btn_scan);
        this.stopButton = (Button) this.activity.findViewById(R.id.btn_stop);
    }



    public void testAllIps() {
        this.showLoadingCircle();

        this.execute("");
    }

    public boolean testConnection() {
        return this.testIp(this.connection.getIp(), this.connection.getPort());
    }

    private boolean testIp(String ip, int port) {
        Log.d(getClass().getPackage().getName(), "testing: " + ip + " : " + port);
        try {
            //Connect and do handshake to test it!
            String data = "handshake=" + this.connection.encodeString(this.connection.getHandshake());
            String result = connection.httpRequest(ip, port, "/handshake", data);
            Log.d(getClass().getPackage().getName(), result);
            return Connection.parseResult(result);
        } catch (Exception e) {
            Log.d(getClass().getPackage().getName(), e.toString());
            return false;
        }
    }

    public void showLoadingCircle() {
        this.progressBar_1.setVisibility(View.VISIBLE);
        this.progressBar_2.setVisibility(View.VISIBLE);
        this.scanButton.setVisibility(View.INVISIBLE);
    }

    public void hideLoadingCircle() {
        this.progressBar_1.setVisibility(View.INVISIBLE);
        this.progressBar_2.setVisibility(View.INVISIBLE);
        this.scanButton.setVisibility(View.VISIBLE);
    }

    @Override
    protected Boolean doInBackground(String... params) {
        this.showLoadingCircle();

        String[] ips = this.connection.getIps();
        int port = this.connection.getPort();

        for(int i = 0; i < ips.length; i++) {
            if (this.testIp(ips[i], port)) {
                this.connection.setIp(ips[i]);
                this.activity.connection.setIp((ips[i]));
                return true;
            }
        }

        return false;
    }

    @Override
    protected void onPostExecute(Boolean b) {
        super.onPostExecute(b);

        Toast toast;
        if (b) {
            //Save connection and start service
            toast = Toast.makeText(this.activity.getApplicationContext(), R.string.connection_successful, Toast.LENGTH_LONG);
            //Save connection
            Log.d("de.andrano", this.connection.toString());
            SharedPreferences sharedPref = this.activity.getSharedPreferences(
                    this.activity.getString(R.string.preference_file_key), Context.MODE_PRIVATE);
            SharedPreferences.Editor editor = sharedPref.edit();
            editor.putString(activity.getString(R.string.preference_connection), this.connection.toString());
            editor.commit();
            //Hide scan button
            this.scanButton.setVisibility(View.INVISIBLE);
            this.stopButton.setVisibility(View.VISIBLE);
            //Start service
            this.activity.handler.startAlarm();
        } else {
            //Show error
            toast = Toast.makeText(this.activity.getApplicationContext(), R.string.connection_failed, Toast.LENGTH_LONG);
        }
        toast.show();
        this.hideLoadingCircle();
    }
}
