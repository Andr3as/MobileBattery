package de.andrano.mobilebattery;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.AsyncTask;
import android.os.BatteryManager;
import android.util.Log;
import android.widget.Toast;

import org.json.JSONObject;

/**
 * Created by Andreas on 13.07.15.
 */
public class AlarmReceiver extends BroadcastReceiver {

    Connection connection;
    Context context;
    SharedPreferences sharedPref;

    String errorTag;

    @Override
    public void onReceive(Context context, Intent intent) {
        this.context = context;

        int status = intent.getIntExtra(BatteryManager.EXTRA_STATUS, -1);
        boolean isCharging = status == BatteryManager.BATTERY_STATUS_CHARGING ||
                status == BatteryManager.BATTERY_STATUS_FULL;

        int level = intent.getIntExtra(BatteryManager.EXTRA_LEVEL, -1);
        int scale = intent.getIntExtra(BatteryManager.EXTRA_SCALE, -1);

        float batteryPct = level / (float)scale;

        this.sharedPref = context.getSharedPreferences(
                context.getString(R.string.preference_file_key), Context.MODE_PRIVATE);
        try {
            String sBreak = "-1";
            String json = sharedPref.getString(context.getString(R.string.preference_connection), sBreak);
            if (json.equals(sBreak)) {
                throw new Exception(context.getString(R.string.connection_pref_failed));
            }
            Log.d("json", json);

            JSONObject obj = new JSONObject(json);
            this.connection = new Connection(obj);
            this.connection.setIp(obj.getString("ip"));

            String encoded_level = connection.encodeString(String.valueOf(level));
            String encoded_handshake = connection.encodeString(connection.getHandshake());
            String encoded_charging = connection.encodeString(String.valueOf(isCharging));
            String data = "level=" + encoded_level
                        + "&handshake=" + encoded_handshake
                        + "&charging=" + encoded_charging;

            this.errorTag = context.getString(R.string.connection_send_failed);

            Request request = new Request(connection);
            AlarmCallback callback = new AlarmCallback();
            request.setCallback(callback);
            request.asyncRequest("/battery", data);
        } catch (Exception e) {
            this.throwError(e.toString());
        }
    }

    private class AlarmCallback implements Callback {

        @Override
        public void callback(Boolean b) {
            if (!b) {
                throwError(errorTag);
            }
        }
    }

    private void throwError(String e) {
        Log.e("throwError", e);
        SharedPreferences.Editor editor = sharedPref.edit();
        editor.remove(context.getString(R.string.preference_connection));
        editor.commit();
    }
}
